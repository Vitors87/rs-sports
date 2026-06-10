import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: activityId } = await params;

    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    // Option A: comments live on the Post associated with the activity
    const post = await prisma.post.findFirst({
      where: { activityId },
      include: {
        comments: {
          include: { user: { select: { name: true, username: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const comments = (post?.comments ?? []).map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      user: { name: c.user.name, username: c.user.username },
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('[GET /api/activities/[id]/comments]', error);
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: activityId } = await params;
    const body = await req.json().catch(() => ({}));
    const content: string = typeof body?.content === 'string' ? body.content.trim() : '';

    if (!content || content.length < 1) {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ error: 'El comentario no puede superar 500 caracteres' }, { status: 400 });
    }

    const [activity, currentUser] = await Promise.all([
      prisma.activity.findUnique({ where: { id: activityId } }),
      getCurrentUser(),
    ]);

    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    // Option A: find or create a Post tied to the activity, then add Comment
    let post = await prisma.post.findFirst({ where: { activityId } });
    if (!post) {
      post = await prisma.post.create({
        data: { userId: activity.userId, activityId, content: activity.title },
      });
    }

    const comment = await prisma.comment.create({
      data: { userId: currentUser.id, postId: post.id, content },
      include: { user: { select: { name: true, username: true } } },
    });

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          user: { name: comment.user.name, username: comment.user.username },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/activities/[id]/comments]', error);
    return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 });
  }
}
