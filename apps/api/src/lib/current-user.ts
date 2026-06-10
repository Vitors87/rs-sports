import { prisma } from './prisma';

export function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: 'demo@rssports.local' },
    update: {},
    create: { email: 'demo@rssports.local', username: 'demo_runner', name: 'Demo Runner' },
  });
}
