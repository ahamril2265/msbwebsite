import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../../../../lib/db";
import { startSession, publicUser, jsonError } from "../../../../lib/auth";

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return jsonError("Enter your email and password.");

  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return jsonError("Email or password is incorrect.", 401);
  }
  await startSession(user);
  return NextResponse.json({ user: publicUser(user) });
}
