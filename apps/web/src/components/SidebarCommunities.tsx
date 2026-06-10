'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface SidebarGroup {
  id: string;
  name: string;
  members: number;
  isMember: boolean;
  sport: { type: string } | null;
}

const COLORS: Record<string, string> = { RUNNING: '#e63946', CYCLING: '#f4a261', TREKKING: '#457b9d' };
const EMOJIS: Record<string, string> = { RUNNING: '🏃', CYCLING: '🚴', TREKKING: '🥾' };

function GroupRow({ group }: { group: SidebarGroup }) {
  const [isMember, setIsMember] = useState(group.isMember);
  const [memberCount, setMemberCount] = useState(group.members);
  const [loading, setLoading] = useState(false);

  const type = group.sport?.type ?? '';
  const c = COLORS[type] ?? 'var(--primary)';

  async function handleJoin() {
    if (loading) return;
    setLoading(true);
    const was = isMember;
    setIsMember(!was);
    setMemberCount((n) => n + (was ? -1 : 1));
    try {
      const res = await apiFetch<{ member: boolean }>(`/api/groups/${group.id}/join`, { method: 'POST' });
      setIsMember(res.member);
    } catch {
      setIsMember(was);
      setMemberCount((n) => n + (was ? 1 : -1));
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
        {EMOJIS[type] ?? '🤝'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{group.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>{memberCount.toLocaleString('es-CL')} miembros</div>
      </div>
      <button
        onClick={handleJoin}
        disabled={loading}
        style={{
          padding: '0.22rem 0.65rem',
          borderRadius: 'var(--r-pill)',
          border: `1.5px solid ${c}`,
          background: isMember ? `${c}14` : 'transparent',
          color: c,
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s',
        }}
      >
        {loading ? '...' : isMember ? '✓' : 'Unirse'}
      </button>
    </div>
  );
}

export function SidebarCommunities({ groups }: { groups: SidebarGroup[] }) {
  if (groups.length === 0) {
    return (
      <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
        Sin comunidades aún.
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
      {groups.map((g) => (
        <GroupRow key={g.id} group={g} />
      ))}
    </div>
  );
}
