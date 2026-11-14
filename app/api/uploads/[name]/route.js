import { readFile } from "fs/promises";
import path from "path";

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Serves admin-uploaded images (files added after build aren't served from /public).
export async function GET(_req, { params }) {
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(data, {
      headers: { "Content-Type": TYPES[name.split(".").pop()], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
