import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Replace the config export with runtime configuration
export const runtime = 'nodejs'; // or 'edge' if you prefer
export const dynamic = 'force-dynamic'; // Ensure this route is dynamic

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Crée le dossier uploads si besoin
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  // Nom du fichier unique
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  // URL publique
  const url = `/uploads/${fileName}`;
  return NextResponse.json({ url });
}