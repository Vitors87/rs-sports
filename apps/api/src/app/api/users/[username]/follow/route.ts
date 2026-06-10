import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const follower = await getCurrentUser();

    const target = await prisma.user.findUnique({ where: { username } });
    if (!target) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (follower.id === target.id) {
      return NextResponse.json({ error: 'No puedes seguirte a ti mismo' }, { status: 400 });
    }

    const existing = await prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId: follower.id, followingId: target.id } },
    });

    if (existing) {
      await prisma.userFollow.delete({
        where: { followerId_followingId: { followerId: follower.id, followingId: target.id } },
      });
      return NextResponse.json({ following: false });
    }

    await prisma.userFollow.create({
      data: { followerId: follower.id, followingId: target.id },
    });
    return NextResponse.json({ following: true });
  } catch (error) {
    console.error('[POST /api/users/[username]/follow]', error);
    return NextResponse.json({ error: 'Error al procesar seguimiento' }, { status: 500 });
  }
}
