import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../../../../lib/db";
import { startSession, publicUser, jsonError, isEmail } from "../../../../lib/auth";

export async function POST(req) {
  const { name, email, password, phone, company } = await req.json().catch(() => ({}));
  if (!name?.trim()) return jsonError("Please enter your name.");
  if (!isEmail(email)) return jsonError("Please enter a valid email.");
  if (!password || password.length < 8) return jsonError("Password must be at least 8 characters.");

  const normalized = email.trim().toLowerCase();
  if (await db.user.findUnique({ where: { email: normalized } })) {
    return jsonError("An account with this email already exists.", 409);
  }

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: normalized,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  await startSession(user);
  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}
