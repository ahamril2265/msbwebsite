import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../../../../lib/db";
import { currentUser, publicUser, jsonError } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ user: publicUser(await currentUser()) });
}

// Update profile details, and optionally change password.
export async function PATCH(req) {
  const user = await currentUser();
  if (!user) return jsonError("Not signed in", 401);
  const { name, phone, company, currentPassword, newPassword } = await req.json().catch(() => ({}));

  const data = {};
  if (name !== undefined) {
    if (!name.trim()) return jsonError("Name can't be empty.");
    data.name = name.trim();
  }
  if (phone !== undefined) data.phone = phone.trim() || null;
  if (company !== undefined) data.company = company.trim() || null;

  if (newPassword) {
    if (newPassword.length < 8) return jsonError("New password must be at least 8 characters.");
    if (!(await bcrypt.compare(currentPassword || "", user.passwordHash))) {
      return jsonError("Current password is incorrect.", 401);
    }
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = await db.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ user: publicUser(updated) });
}
