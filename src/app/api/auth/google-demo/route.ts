import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Demo Google sign-in fallback - creates a Google-style user without real OAuth
// This is used when Google OAuth credentials are not configured
export async function POST(req: NextRequest) {
  try {
    // Generate a demo Google user
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const email = `google.user.${timestamp}@gmail.com`;
    const name = `Google User ${randomSuffix}`;

    // Check if a demo Google user already exists (reuse for demo)
    let user = await db.user.findFirst({
      where: { email: { contains: 'gmail.com' } },
      orderBy: { createdAt: 'desc' },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&size=200`,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&size=200`,
          role: 'user',
          emailVerified: new Date(),
        },
      });

      // Create account link
      await db.account.create({
        data: {
          userId: user.id,
          provider: 'google',
          providerAccountId: `google-demo-${user.id}`,
          type: 'oauth',
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || user.image,
      role: user.role,
    });
  } catch (error) {
    console.error('Google demo sign-in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in with Google' },
      { status: 500 }
    );
  }
}
