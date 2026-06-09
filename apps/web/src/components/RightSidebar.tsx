import Link from 'next/link';
import { EventCard, type EventCardData } from './EventCard';
import { RankingCard, type RankingEntry } from './RankingCard';

const DEMO_EVENTS: EventCardData[] = [
  {
    id: 'e1',
    title: 'Corrida Nocturna Santiago',
    location: 'Paseo El Bosque',
    date: '2026-07-20T20:00:00',
    participants: 1240,
    maxParticipants: 3000,
    sport: { name: 'Running', type: 'RUNNING' },
  },
  {
    id: 'e2',
    title: 'Trekking Cerro Provincia',
    location: 'Sendero Cerro Provincia',
    date: '2026-07-05T07:00:00',
    participants: 89,
    maxParticipants: 200,
    sport: { name: 'Trekking', type: 'TREKKING' },
  },
  {
    id: 'e3',
    title: 'Desafío MTB Andes',
    location: 'Cajón del Maipo',
    date: '2026-08-10T09:00:00',
    participants: 312,
    maxParticipants: 500,
    sport: { name: 'Ciclismo', type: 'CYCLING' },
  },
];

const DEMO_RANKING: RankingEntry[] = [
  { position: 1, name: 'Carlos Morales', username: 'carlos_morales', score: 187.5, unit: 'km', activities: 12 },
  { position: 2, name: 'Valentina Ruiz', username: 'valentina_ruiz', score: 156.2, unit: 'km', activities: 9 },
  { position: 3, name: 'Víctor Riquelme', username: 'victor_riquelme', score: 131.3, unit: 'km', activities: 8 },
];

function SidebarCard({ title, link, children }: { title: string; link?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
        {link && (
          <Link href={link} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        )}
      </div>
      <div style={{ padding: '0.25rem 0.75rem 0.75rem' }}>{children}</div>
    </section>
  );
}

export function RightSidebar() {
  return (
    <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
      <SidebarCard title="Próximos eventos" link="/events">
        {DEMO_EVENTS.map((e) => (
          <EventCard key={e.id} event={e} compact />
        ))}
      </SidebarCard>

      <SidebarCard title="Top corredores (junio)" link="/rankings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.25rem' }}>
          {DEMO_RANKING.map((r) => (
            <RankingCard key={r.username} entry={r} />
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title="Comunidades activas" link="/groups">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
          {[
            { name: 'Running Santiago', members: 1840, type: 'RUNNING' },
            { name: 'MTB RM', members: 920, type: 'CYCLING' },
            { name: 'Trekking Chile', members: 1120, type: 'TREKKING' },
          ].map(({ name, members, type }) => {
            const colors: Record<string, string> = { RUNNING: '#e63946', CYCLING: '#f4a261', TREKKING: '#457b9d' };
            const emojis: Record<string, string> = { RUNNING: '🏃', CYCLING: '🚴', TREKKING: '🥾' };
            const c = colors[type];
            return (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--r-sm)',
                    background: `${c}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {emojis[type]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>{members.toLocaleString('es-CL')} miembros</div>
                </div>
                <button
                  style={{
                    padding: '0.22rem 0.65rem',
                    borderRadius: 'var(--r-pill)',
                    border: `1.5px solid ${c}`,
                    background: 'transparent',
                    color: c,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Unirse
                </button>
              </div>
            );
          })}
        </div>
      </SidebarCard>
    </aside>
  );
}
