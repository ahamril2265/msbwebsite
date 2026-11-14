import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";
import { SESSION_COOKIE, readSession, signSession, cookieOptions } from "./session";

export const publicUser = (u) =>
  u && { id: u.id, email: u.email, name: u.name, phone: u.phone, company: u.company, role: u.role };

export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const s = await readSession(token);
  if (!s) return null;
  return db.user.findUnique({ where: { id: s.uid } });
}

export async function startSession(user) {
  (await cookies()).set(SESSION_COOKIE, await signSession(user), cookieOptions);
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const jsonError = (message, status = 400) => NextResponse.json({ error: message }, { status });

// Returns the admin user, or a 401/403 response to send back.
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) return { error: jsonError("Not signed in", 401) };
  if (user.role !== "admin") return { error: jsonError("Admins only", 403) };
  return { user };
}

export const isEmail = (s) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
