import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Check if Supabase is configured (lazy check without importing)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
      // Dynamically import Supabase only when configured
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`,
        },
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ url: data.url });
    }

    // Demo mode: Simulate Google sign-in
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const email = `google.user.${timestamp}@gmail.com`;
    const name = `Google User ${randomSuffix}`;

    // Reuse existing Google demo user if available
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
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role },
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json({ error: 'Failed to sign in with Google' }, { status: 500 });
  }
}
