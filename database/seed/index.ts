// Ejecutar: npx tsx database/seed/index.ts
// Requiere: npm run db:generate primero
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ── Sports ────────────────────────────────────────────────────
  const [running, cycling, trekking] = await Promise.all([
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
  console.log('✓ Sports:', [running, cycling, trekking].map((s) => s.name).join(', '));

  // ── Demo users ────────────────────────────────────────────────
  const USERS = [
    { email: 'demo@rssports.local', username: 'demo_runner', name: 'Demo Runner', bio: 'Usuario de prueba de RS Sports.' },
    { email: 'victor@rssports.demo', username: 'victor_riquelme', name: 'Víctor Riquelme', bio: 'Runner apasionado. 5 maratones completados. Santiago, Chile.' },
    { email: 'maria@rssports.demo', username: 'maria_gonzalez', name: 'María González', bio: 'Trail runner y trekker. Amo la montaña y los amaneceres en cumbre.' },
    { email: 'pedro@rssports.demo', username: 'pedro_soto', name: 'Pedro Soto', bio: 'Ciclista MTB. Los Andes son mi hogar. Bajadas técnicas en Farellones.' },
    { email: 'camila@rssports.demo', username: 'camila_herrera', name: 'Camila Herrera', bio: 'Trekker y fotógrafa de montaña. Chile de norte a sur.' },
    { email: 'felipe@rssports.demo', username: 'felipe_munoz', name: 'Felipe Muñoz', bio: 'Corredor urbano. Personal best 10K en 42 min. Entrenando para maratón.' },
    { email: 'daniela@rssports.demo', username: 'daniela_torres', name: 'Daniela Torres', bio: 'Ciclista de ruta y MTB. Ruta costera y cordillera.' },
    { email: 'carlos@rssports.demo', username: 'carlos_morales', name: 'Carlos Morales', bio: 'Ultra trail runner. 100K en los Andes es mi objetivo 2026.' },
    { email: 'sofia@rssports.demo', username: 'sofia_castro', name: 'Sofía Castro', bio: 'Running y yoga al aire libre. Mente sana en cuerpo sano.' },
    { email: 'rodrigo@rssports.demo', username: 'rodrigo_bravo', name: 'Rodrigo Bravo', bio: 'MTB Enduro. Bajadas técnicas y gravedad como motor.' },
    { email: 'valentina@rssports.demo', username: 'valentina_ruiz', name: 'Valentina Ruiz', bio: 'Trail running en Patagonia. Guardaparques y montañista.' },
  ];

  const users = await Promise.all(
    USERS.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, bio: u.bio },
        create: u,
      }),
    ),
  );
  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));
  console.log(`✓ Users: ${users.length} upserted`);

  // ── Activities ────────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  const ACTIVITIES = [
    // Running
    { username: 'victor_riquelme', sport: running, title: '10K Parque Bicentenario', description: 'Ritmo estable durante todo el recorrido. Buen día para correr.', distance: 10.2, duration: 54, elevation: 45, date: daysAgo(1) },
    { username: 'victor_riquelme', sport: running, title: 'Fondo 15K Las Condes', description: 'Subida por Av. Las Condes hasta el barrio alto. Exigente pero satisfactorio.', distance: 15.1, duration: 82, elevation: 120, date: daysAgo(5) },
    { username: 'carlos_morales', sport: running, title: 'Largo dominical 22K', description: 'Rodada larga de domingo. Pasé por el parque y subí hasta La Reina.', distance: 22.0, duration: 140, elevation: 350, date: daysAgo(2) },
    { username: 'carlos_morales', sport: running, title: 'Trail San Cristóbal 12K', description: 'Subida al cerro San Cristóbal por el sendero norte. Vistas increíbles.', distance: 12.3, duration: 80, elevation: 420, date: daysAgo(8) },
    { username: 'felipe_munoz', sport: running, title: 'Entrenamiento intervalos', description: '6x1000m al ritmo de 5K. Me fue bien, mejorando mi tiempo.', distance: 6.0, duration: 32, elevation: 15, date: daysAgo(3) },
    { username: 'sofia_castro', sport: running, title: 'Carrera mañanera 8K', description: 'Salida a las 7am por el parque. Frío pero energizante.', distance: 8.5, duration: 48, elevation: 30, date: daysAgo(4) },
    { username: 'valentina_ruiz', sport: running, title: '10K en el Velódromo', description: 'Pista plana, ritmo constante. Probando nuevo calzado.', distance: 10.0, duration: 51, elevation: 20, date: daysAgo(6) },
    { username: 'maria_gonzalez', sport: running, title: 'Carrera nocturna 5K', description: 'Corro de noche por el parque. Iluminación perfecta y buen ambiente.', distance: 5.0, duration: 28, elevation: 0, date: daysAgo(9) },
    { username: 'demo_runner', sport: running, title: 'Fondo 21K entrenamiento', description: 'Preparación para la maratón. Media distancia completada sin problemas.', distance: 21.0, duration: 118, elevation: 200, date: daysAgo(7) },
    // Cycling
    { username: 'pedro_soto', sport: cycling, title: 'Ruta Cajón del Maipo', description: 'Ida y vuelta hasta el embalse. Ascenso brutal con recompensa total en la bajada.', distance: 65.0, duration: 210, elevation: 1200, date: daysAgo(1) },
    { username: 'pedro_soto', sport: cycling, title: 'MTB Las Vizcachas', description: 'Downhill técnico, varias caídas pero mucha adrenalina. Imprescindible casco.', distance: 35.0, duration: 180, elevation: 850, date: daysAgo(10) },
    { username: 'daniela_torres', sport: cycling, title: 'Ruta costera Viña del Mar', description: 'Ciclovía costera desde Valparaíso hasta Viña. Viento en contra pero paisaje espectacular.', distance: 80.0, duration: 240, elevation: 600, date: daysAgo(3) },
    { username: 'rodrigo_bravo', sport: cycling, title: 'MTB Enduro Farellones', description: 'Bajada técnica desde Farellones. Stones y roots. Adrenalina pura.', distance: 28.0, duration: 150, elevation: 1100, date: daysAgo(2) },
    { username: 'daniela_torres', sport: cycling, title: 'Ciclovía maratón 42K', description: 'Recorrido urbano por la ciclovía de Providencia y Las Condes. Desafío personal completado.', distance: 42.0, duration: 130, elevation: 180, date: daysAgo(12) },
    // Trekking
    { username: 'camila_herrera', sport: trekking, title: 'Cerro Provincia', description: 'Ascenso al Cerro Provincia por sendero norte. Vista de 360° de los Andes. Impresionante.', distance: 18.0, duration: 360, elevation: 1500, date: daysAgo(4) },
    { username: 'camila_herrera', sport: trekking, title: 'Cerro Pintor', description: 'Ruta clásica al Cerro Pintor. Nieve en cumbre. Viento fuerte pero despejado.', distance: 12.0, duration: 280, elevation: 1200, date: daysAgo(15) },
    { username: 'maria_gonzalez', sport: trekking, title: 'Manquehue clásico', description: 'Subida express al Manquehue. El mejor cerro-isla de Santiago, siempre espectacular.', distance: 10.0, duration: 240, elevation: 800, date: daysAgo(7) },
    { username: 'valentina_ruiz', sport: trekking, title: 'Laguna de Los Patos', description: 'Ruta a la laguna. Agua turquesa y silencio total. Patagonia en su máxima expresión.', distance: 16.0, duration: 300, elevation: 900, date: daysAgo(20) },
    { username: 'carlos_morales', sport: trekking, title: 'Tres Hermanos loop', description: 'Circuito completo Tres Hermanos. 25km y 2000m de desnivel. El más exigente del año.', distance: 25.0, duration: 480, elevation: 2000, date: daysAgo(14) },
    { username: 'felipe_munoz', sport: running, title: 'Trail Parque La Dehesa', description: 'Trail técnico con raíces y piedras. Diferente al asfalto, el cuerpo lo nota.', distance: 9.0, duration: 55, elevation: 300, date: daysAgo(11) },
  ];

  let actCount = 0;
  for (const a of ACTIVITIES) {
    const user = byUsername[a.username];
    if (!user) { console.warn(`User not found: ${a.username}`); continue; }
    const exists = await prisma.activity.findFirst({
      where: { userId: user.id, title: a.title },
    });
    if (!exists) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          sportId: a.sport.id,
          title: a.title,
          description: a.description,
          distance: a.distance,
          duration: a.duration,
          elevation: a.elevation,
          date: a.date,
          status: 'PUBLISHED',
        },
      });
      actCount++;
    }
  }
  console.log(`✓ Activities: ${actCount} created (existing skipped)`);

  // ── Events ────────────────────────────────────────────────────
  const EVENTS = [
    { sportId: running.id, title: 'Maratón de Santiago 2026', description: 'El evento de running más importante de Chile. 42K por las principales avenidas de Santiago. Inscripciones abiertas.', location: "Parque O'Higgins, Santiago", date: new Date('2026-11-15T08:00:00'), maxParticipants: 10000 },
    { sportId: running.id, title: 'Corrida Nocturna Santiago', description: 'Corre de noche por el centro de Santiago. Distancias de 5K y 10K disponibles. Ambiente festivo garantizado.', location: 'Paseo El Bosque Norte', date: new Date('2026-07-20T20:00:00'), maxParticipants: 3000 },
    { sportId: cycling.id, title: 'Desafío MTB Andes', description: 'Ruta técnica de 35km por el Cajón del Maipo con 850m de desnivel. Para ciclistas experimentados.', location: 'Cajón del Maipo, RM', date: new Date('2026-08-10T09:00:00'), maxParticipants: 500 },
    { sportId: trekking.id, title: 'Trekking Cerro Provincia', description: 'Ascenso guiado al Cerro Provincia con vista panorámica del Valle de Aconcagua y los Andes centrales.', location: 'Cerro Provincia, RM', date: new Date('2026-07-05T07:00:00'), maxParticipants: 200 },
    { sportId: running.id, title: 'Trail Patagonia 50K', description: 'Ultra trail en el corazón de la Patagonia. Para corredores de montaña experimentados. Paisajes únicos en el mundo.', location: 'Torres del Paine, Magallanes', date: new Date('2026-12-01T07:00:00'), maxParticipants: 300 },
  ];

  const eventMap: Record<string, string> = {};
  let evtCount = 0;
  for (const e of EVENTS) {
    let record = await prisma.event.findFirst({ where: { title: e.title } });
    if (!record) {
      record = await prisma.event.create({ data: { ...e, status: 'UPCOMING' } });
      evtCount++;
    }
    eventMap[e.title] = record.id;
  }
  console.log(`✓ Events: ${evtCount} created`);

  // ── Event participants ────────────────────────────────────────
  const EVENT_PARTICIPANTS: Array<{ eventTitle: string; usernames: string[] }> = [
    { eventTitle: 'Maratón de Santiago 2026', usernames: ['victor_riquelme', 'carlos_morales', 'felipe_munoz', 'sofia_castro', 'valentina_ruiz', 'demo_runner'] },
    { eventTitle: 'Corrida Nocturna Santiago', usernames: ['maria_gonzalez', 'demo_runner', 'victor_riquelme', 'sofia_castro'] },
    { eventTitle: 'Desafío MTB Andes', usernames: ['pedro_soto', 'daniela_torres', 'rodrigo_bravo'] },
    { eventTitle: 'Trekking Cerro Provincia', usernames: ['camila_herrera', 'maria_gonzalez', 'valentina_ruiz'] },
    { eventTitle: 'Trail Patagonia 50K', usernames: ['carlos_morales', 'valentina_ruiz', 'demo_runner'] },
  ];

  let partCount = 0;
  for (const { eventTitle, usernames } of EVENT_PARTICIPANTS) {
    const eventId = eventMap[eventTitle];
    if (!eventId) continue;
    for (const username of usernames) {
      const user = byUsername[username];
      if (!user) continue;
      await prisma.eventParticipant.upsert({
        where: { userId_eventId: { userId: user.id, eventId } },
        update: {},
        create: { userId: user.id, eventId },
      });
      partCount++;
    }
  }
  console.log(`✓ Event participants: ${partCount} upserted`);

  // ── Groups ────────────────────────────────────────────────────
  const GROUPS = [
    { sportId: running.id, name: 'Running Santiago', description: 'Comunidad de corredores urbanos de Santiago. Salidas grupales los sábados y domingos por el parque.' },
    { sportId: running.id, name: 'Trail Chile', description: 'Para quienes aman correr en montaña y trail. Exploramos senderos de todo Chile juntos.' },
    { sportId: cycling.id, name: 'MTB RM', description: 'Mountain bikers de la Región Metropolitana. Rutas técnicas y cross-country los fines de semana.' },
    { sportId: trekking.id, name: 'Trekking Chile', description: 'Trekkistas de todo Chile. Organizamos salidas a cumbres, senderos y parques nacionales.' },
    { sportId: running.id, name: 'Corredores 10K', description: 'Para quienes entrenan la distancia de 10K. Planes de entrenamiento compartidos y motivación colectiva.' },
  ];

  const groupMap: Record<string, string> = {};
  let grpCount = 0;
  for (const g of GROUPS) {
    let record = await prisma.group.findFirst({ where: { name: g.name } });
    if (!record) {
      record = await prisma.group.create({ data: g });
      grpCount++;
    }
    groupMap[g.name] = record.id;
  }
  console.log(`✓ Groups: ${grpCount} created`);

  // ── Group members ─────────────────────────────────────────────
  const GROUP_MEMBERS: Array<{ groupName: string; usernames: string[] }> = [
    { groupName: 'Running Santiago', usernames: ['victor_riquelme', 'carlos_morales', 'felipe_munoz', 'sofia_castro', 'maria_gonzalez', 'demo_runner'] },
    { groupName: 'Trail Chile', usernames: ['valentina_ruiz', 'carlos_morales', 'demo_runner', 'victor_riquelme'] },
    { groupName: 'MTB RM', usernames: ['pedro_soto', 'daniela_torres', 'rodrigo_bravo'] },
    { groupName: 'Trekking Chile', usernames: ['camila_herrera', 'maria_gonzalez', 'valentina_ruiz', 'carlos_morales'] },
    { groupName: 'Corredores 10K', usernames: ['victor_riquelme', 'felipe_munoz', 'sofia_castro', 'demo_runner', 'maria_gonzalez', 'valentina_ruiz', 'carlos_morales'] },
  ];

  let memCount = 0;
  for (const { groupName, usernames } of GROUP_MEMBERS) {
    const groupId = groupMap[groupName];
    if (!groupId) continue;
    for (const username of usernames) {
      const user = byUsername[username];
      if (!user) continue;
      await prisma.groupMember.upsert({
        where: { userId_groupId: { userId: user.id, groupId } },
        update: {},
        create: { userId: user.id, groupId },
      });
      memCount++;
    }
  }
  console.log(`✓ Group members: ${memCount} upserted`);

  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
