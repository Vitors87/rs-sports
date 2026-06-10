import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const route = await prisma.route.findUnique({
      where: { id },
      include: { sport: { select: { id: true, name: true, type: true } } },
    });
    if (!route) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ route });
  } catch (error) {
    console.error('[GET /api/routes/[id]]', error);
    return NextResponse.json({ error: 'Error al obtener la ruta' }, { status: 500 });
  }
}
