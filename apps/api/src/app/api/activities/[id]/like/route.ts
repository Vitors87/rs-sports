import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: activityId } = await params;

    const [activity, currentUser] = await Promise.all([
      prisma.activity.findUnique({ where: { id: activityId } }),
      getCurrentUser(),
    ]);

    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    let post = await prisma.post.findFirst({ where: { activityId } });
    if (!post) {
      post = await prisma.post.create({
        data: { userId: activity.userId, activityId, content: activity.title },
      });
    }

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: currentUser.id, postId: post.id } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({ data: { userId: currentUser.id, postId: post.id } });
    }

    const likeCount = await prisma.like.count({ where: { postId: post.id } });

    return NextResponse.json({ liked: !existing, likeCount });
  } catch (error) {
    console.error('[POST /api/activities/[id]/like]', error);
    return NextResponse.json({ error: 'Error al procesar el like' }, { status: 500 });
  }
}
