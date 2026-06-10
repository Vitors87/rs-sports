import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 30) return date.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
  if (d > 1) return `Hace ${d} días`;
  if (d === 1) return 'Ayer';
  if (h > 0) return `Hace ${h}h`;
  if (m > 0) return `Hace ${m}m`;
  return 'Ahora mismo';
}

export async function GET() {
  try {
    const [groups, currentUser] = await Promise.all([
      prisma.group.findMany({
        include: {
          sport: { select: { id: true, name: true, type: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      getCurrentUser(),
    ]);

    const myMemberships = await prisma.groupMember.findMany({
      where: { userId: currentUser.id, groupId: { in: groups.map((g) => g.id) } },
      select: { groupId: true },
    });
    const memberSet = new Set(myMemberships.map((m) => m.groupId));

    const payload = groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      members: g._count.members,
      recentActivity: timeAgo(g.updatedAt),
      isMember: memberSet.has(g.id),
      sport: g.sport,
    }));

    return NextResponse.json({ groups: payload });
  } catch (error) {
    console.error('[GET /api/groups]', error);
    return NextResponse.json({ error: 'Error al obtener comunidades' }, { status: 500 });
  }
}
