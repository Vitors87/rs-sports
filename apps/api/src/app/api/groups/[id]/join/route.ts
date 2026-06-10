import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: groupId } = await params;
    const user = await getCurrentUser();

    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: user.id, groupId } },
    });

    if (existing) {
      await prisma.groupMember.delete({
        where: { userId_groupId: { userId: user.id, groupId } },
      });
      return NextResponse.json({ member: false });
    }

    await prisma.groupMember.create({ data: { userId: user.id, groupId } });
    return NextResponse.json({ member: true });
  } catch (error) {
    console.error('[POST /api/groups/[id]/join]', error);
    return NextResponse.json({ error: 'Error al procesar membresía' }, { status: 500 });
  }
}
