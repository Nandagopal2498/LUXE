import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let user = await db.user.findUnique({
      where: { email },
    });

    // Auto-create demo users if they don't exist yet
    if (!user && (email === 'user@luxe.com' || email === 'admin@luxe.com')) {
      const name = email === 'admin@luxe.com' ? 'Demo Admin' : 'Demo User';
      const role = email === 'admin@luxe.com' ? 'admin' : 'user';
      user = await db.user.create({
        data: {
          email,
          password,
          name,
          role,
        }
      });
    }

    // In a real app, you would use bcrypt to compare passwords
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
