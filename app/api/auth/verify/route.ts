import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/src/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided', valid: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', valid: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: user,
      expiresAt: decoded.exp
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token', valid: false },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided', valid: false },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, role: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', valid: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: user,
      expiresAt: decoded.exp
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token', valid: false },
      { status: 401 }
    );
  }
}