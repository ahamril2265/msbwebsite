import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireAdmin, jsonError } from "../../../../../lib/auth";

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { status } = await req.json().catch(() => ({}));
  if (!["new", "contacted", "closed"].includes(status)) return jsonError("Unknown status.");
  const quote = await db.quoteRequest.update({ where: { id: Number((await params).id) }, data: { status } });
  return NextResponse.json({ quote });
}
