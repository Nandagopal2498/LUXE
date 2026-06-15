import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      // Sync user to local DB
      let localUser = await db.user.findUnique({ where: { email } });
      if (!localUser) {
        localUser = await db.user.create({
          data: {
            email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url || null,
            image: data.user.user_metadata?.avatar_url || null,
            role: 'user',
            emailVerified: new Date(),
          },
        });
      }
      return NextResponse.json({
        user: { id: localUser.id, email: localUser.email, name: localUser.name, avatar: localUser.avatar, role: localUser.role },
        session: data.session,
      });
    }

    // Fallback: Local auth with Prisma
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
  }
}
