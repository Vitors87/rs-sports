import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

function computeAchievements(
  activities: Array<{ sport: { type: string }; distance: number | null }>,
): Achievement[] {
  const result: Achievement[] = [];

  if (activities.some((a) => a.sport.type === 'RUNNING' && (a.distance ?? 0) >= 10)) {
    result.push({ icon: '🏅', title: 'Primer 10K', description: 'Completó una actividad de running de al menos 10 km' });
  }

  if (activities.filter((a) => a.sport.type === 'TREKKING').length >= 3) {
    result.push({ icon: '⛰️', title: 'Trekker activo', description: 'Tiene 3 o más actividades de trekking registradas' });
  }

  const cyclingKm = activities
    .filter((a) => a.sport.type === 'CYCLING')
    .reduce((sum, a) => sum + (a.distance ?? 0), 0);
  if (cyclingKm >= 100) {
    result.push({ icon: '🚴', title: 'Ciclista frecuente', description: 'Acumuló 100 km o más en ciclismo' });
  }

  if (activities.filter((a) => a.sport.type === 'RUNNING').length >= 5) {
    result.push({ icon: '🏃', title: 'Runner constante', description: 'Tiene 5 o más actividades de running registradas' });
  }

  const sportTypes = new Set(activities.map((a) => a.sport.type));
  if (['RUNNING', 'CYCLING', 'TREKKING'].every((t) => sportTypes.has(t))) {
    result.push({ icon: '🌿', title: 'Explorador outdoor', description: 'Tiene actividades en las 3 disciplinas' });
  }

  return result;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const body = await req.json().catch(() => ({}));

    const { name, bio, avatarUrl } = body as Record<string, unknown>;

    // TODO: when auth is added, verify req.user.username === username
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
      }
      if (name.trim().length > 80) {
        return NextResponse.json({ error: 'El nombre no puede superar 80 caracteres' }, { status: 400 });
      }
    }
    if (bio !== undefined && typeof bio !== 'string') {
      return NextResponse.json({ error: 'Bio inválida' }, { status: 400 });
    }
    if (bio !== undefined && (bio as string).length > 300) {
      return NextResponse.json({ error: 'La bio no puede superar 300 caracteres' }, { status: 400 });
    }
    if (avatarUrl !== undefined && avatarUrl !== null && typeof avatarUrl !== 'string') {
      return NextResponse.json({ error: 'avatarUrl inválida' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const data: { name?: string; bio?: string | null; avatarUrl?: string | null } = {};
    if (name !== undefined) data.name = (name as string).trim();
    if (bio !== undefined) data.bio = (bio as string).trim() || null;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl as string | null;

    const updated = await prisma.user.update({ where: { username }, data });

    return NextResponse.json({
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
      },
    });
  } catch (error) {
    console.error('[PATCH /api/profile/[username]]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    const [user, currentUser] = await Promise.all([
      prisma.user.findUnique({
        where: { username },
        include: {
          activities: {
            include: { sport: { select: { id: true, name: true, type: true } } },
            orderBy: { date: 'desc' },
            take: 20,
          },
          _count: { select: { activities: true, followers: true, following: true } },
        },
      }),
      getCurrentUser(),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isFollowing =
      user.id !== currentUser.id
        ? !!(await prisma.userFollow.findUnique({
            where: { followerId_followingId: { followerId: currentUser.id, followingId: user.id } },
          }))
        : false;

    const totalKm = user.activities.reduce((sum, a) => sum + (a.distance ?? 0), 0);
    const { activities, _count, ...userBase } = user;

    return NextResponse.json({
      user: {
        ...userBase,
        stats: {
          activities: _count.activities,
          followers: _count.followers,
          following: _count.following,
          totalKm: Math.round(totalKm * 10) / 10,
        },
      },
      activities: activities.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        distance: a.distance,
        duration: a.duration,
        elevation: a.elevation,
        date: a.date.toISOString(),
        user: { name: userBase.name, username: userBase.username },
        sport: a.sport,
      })),
      achievements: computeAchievements(activities),
      isFollowing,
      isSelf: user.id === currentUser.id,
    });
  } catch (error) {
    console.error('[GET /api/profile/[username]]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
