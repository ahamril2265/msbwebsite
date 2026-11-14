import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin, jsonError } from "../../../../lib/auth";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Saves a product photo to ./uploads and returns its public URL.
export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const file = (await req.formData()).get("file");
  if (!file || typeof file === "string") return jsonError("No file received.");
  const ext = TYPES[file.type];
  if (!ext) return jsonError("Use a JPG, PNG or WebP image.");
  if (file.size > 5 * 1024 * 1024) return jsonError("Image must be under 5 MB.");

  const name = `${crypto.randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/uploads/${name}` }, { status: 201 });
}
