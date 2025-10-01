import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

// Get all cars
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
        include: {
            categoryRel: true, // Include related category
            reservations:true
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error("GET ERROR", error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// You can add other methods (POST, PUT, DELETE) as needed