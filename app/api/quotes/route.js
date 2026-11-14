import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { jsonError, isEmail } from "../../../lib/auth";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const s = (v) => (v || "").toString().trim();
  if (!s(b.name)) return jsonError("Please enter your name.");
  if (!isEmail(s(b.email))) return jsonError("Please enter a valid email.");
  if (s(b.message).length < 5) return jsonError("Tell us what you need.");

  const quote = await db.quoteRequest.create({
    data: { name: s(b.name), email: s(b.email), phone: s(b.phone) || null, company: s(b.company) || null, message: s(b.message).slice(0, 4000) },
  });
  return NextResponse.json({ id: quote.id }, { status: 201 });
}
