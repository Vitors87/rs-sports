import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivitySchema } from '@rs-sports/validation';

const DEMO_USER = {
  email: 'demo@rssports.local',
  username: 'demo_runner',
  name: 'Demo Runner',
};

async function getOrCreateDemoUser() {
  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {},
    create: DEMO_USER,
  });
}

const ACTIVITY_SELECT = {
  include: {
    user: { select: { name: true, username: true, avatarUrl: true } },
    sport: { select: { id: true, name: true, type: true } },
  },
} as const;

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      ...ACTIVITY_SELECT,
    });
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('[GET /api/activities]', error);
    return NextResponse.json({ error: 'Error al obtener actividades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Payload inválido', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sportId, title, description, distance, duration, elevation, date } =
      parsed.data;

    const sport = await prisma.sport.findUnique({ where: { id: sportId } });
    if (!sport) {
      return NextResponse.json({ error: 'Deporte no encontrado' }, { status: 404 });
    }

    const user = await getOrCreateDemoUser();

    const activity = await prisma.activity.create({
      data: { userId: user.id, sportId, title, description, distance, duration, elevation, date },
      ...ACTIVITY_SELECT,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/activities]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
