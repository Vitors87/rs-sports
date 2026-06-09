'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/feed',                 icon: '🏠', label: 'Inicio' },
  { href: '/profile/demo_runner',  icon: '👤', label: 'Mi perfil' },
  { href: '/events',               icon: '🗓', label: 'Eventos' },
  { href: '/groups',               icon: '👥', label: 'Comunidades' },
  { href: '/rankings',             icon: '🏆', label: 'Rankings' },
];

export function LeftSidebar() {
  const path = usePathname();

  return (
    <aside
      style={{
        position: 'sticky',
        top: 'calc(var(--nav-h) + 1.5rem)',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {LINKS.map(({ href, icon, label }) => {
          const active = path === href || (href !== '/feed' && path.startsWith(href + '/'));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--r)',
                fontSize: '0.9rem',
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--primary)' : 'var(--text-2)',
                background: active ? 'var(--primary-glow)' : 'transparent',
                transition: 'all 0.14s',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '1.05rem', width: 22, textAlign: 'center', flexShrink: 0 }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Demo user card */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: 'var(--r)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            DR
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text)' }}>Demo Runner</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>@demo_runner</div>
          </div>
        </div>
        <Link
          href="/profile/demo_runner"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.4rem',
            borderRadius: 'var(--r-sm)',
            background: 'var(--bg)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-3)',
            border: '1px solid var(--border)',
          }}
        >
          Ver perfil
        </Link>
      </div>
    </aside>
  );
}
