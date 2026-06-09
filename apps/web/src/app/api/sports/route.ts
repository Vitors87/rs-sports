import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ sports });
  } catch (error) {
    console.error('[GET /api/sports]', error);
    return NextResponse.json({ error: 'Error al obtener deportes' }, { status: 500 });
  }
}
