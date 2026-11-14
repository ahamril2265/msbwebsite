import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const quotes = await db.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ quotes });
}
