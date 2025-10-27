import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";


// Get all cars
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        // vehicles: true, // Include related category
      },
      orderBy: { createdAt: "desc" },
    });
    

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET ERROR", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}