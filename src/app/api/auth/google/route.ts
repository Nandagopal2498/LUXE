import { NextResponse } from "next/server";

export async function POST() {
  // If Supabase OAuth is configured, this endpoint could return the OAuth URL
  // For now, return an error to prevent SyntaxErrors
  return NextResponse.json({ error: "Google sign-in is not configured yet. Please use email or demo accounts." }, { status: 501 });
}
