// Ejecutar: npx tsx database/seed/index.ts
// Requiere: npm run db:generate primero
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sports = await Promise.all([
    prisma.sport.upsert({
      where: { type: 'RUNNING' },
      update: {},
      create: { type: 'RUNNING', name: 'Running', description: 'Carreras a pie en cualquier terreno' },
    }),
    prisma.sport.upsert({
      where: { type: 'CYCLING' },
      update: {},
      create: { type: 'CYCLING', name: 'Ciclismo', description: 'Ciclismo de ruta y mountain bike' },
    }),
    prisma.sport.upsert({
      where: { type: 'TREKKING' },
      update: {},
      create: { type: 'TREKKING', name: 'Trekking', description: 'Senderismo y excursiones de montaña' },
    }),
  ]);

  console.log(`Seeded ${sports.length} sports:`, sports.map((s) => s.name).join(', '));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
