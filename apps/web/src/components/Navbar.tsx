'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Avatar } from './Avatar';
import { useCurrentUser } from '@/contexts/UserContext';

const NAV = [
  { href: '/feed', label: 'Feed' },
  { href: '/events', label: 'Eventos' },
  { href: '/groups', label: 'Comunidades' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/routes', label: 'Rutas' },
];

export function Navbar() {
  const path = usePathname();
  const isHome = path === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useCurrentUser();

  const bg = isHome ? 'rgba(10,22,40,0.88)' : 'rgba(255,255,255,0.96)';
  const border = isHome ? 'rgba(255,255,255,0.08)' : 'var(--border)';
  const logoColor = isHome ? '#fff' : 'var(--text)';
  const mutedColor = isHome ? 'rgba(255,255,255,0.6)' : 'var(--text-3)';
  const profileBorder = isHome ? 'rgba(255,255,255,0.2)' : 'var(--border)';
  const profileColor = isHome ? 'rgba(255,255,255,0.85)' : 'var(--text-2)';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          height: 'var(--nav-h)',
          background: bg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1.25rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontWeight: 900,
            fontSize: '1.2rem',
            letterSpacing: '-0.04em',
            color: logoColor,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          RS<span style={{ color: 'var(--primary)' }}>·</span>Sports
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '0.1rem', flex: 1 }} className="hide-md">
          {NAV.map(({ href, label }) => {
            const active = path === href || path.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '0.38rem 0.85rem',
                  borderRadius: 'var(--r-pill)',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--primary)' : mutedColor,
                  background: active ? 'var(--primary-glow)' : 'transparent',
                  transition: 'all 0.14s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div style={{ flex: 1 }} className="show-md-only" />

        {/* Profile CTA */}
        <Link
          href="/profile/demo_runner"
          className="hide-md"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.9rem 0.35rem 0.45rem',
            borderRadius: 'var(--r-pill)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: profileColor,
            border: `1.5px solid ${profileBorder}`,
            flexShrink: 0,
            transition: 'all 0.14s',
          }}
        >
          <Avatar name={user?.name ?? 'Demo Runner'} avatarUrl={user?.avatarUrl} size={26} />
          Mi perfil
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            padding: '0.5rem',
            color: logoColor,
          }}
          className="show-md-only"
          aria-label="Menú"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: 'block', width: 22, height: 2, background: 'currentColor', borderRadius: 2 }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-h)',
            left: 0,
            right: 0,
            zIndex: 299,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--r)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: path.startsWith(href) ? 'var(--primary)' : 'var(--text-2)',
                background: path.startsWith(href) ? 'var(--primary-glow)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/profile/demo_runner"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--r)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-2)',
              marginTop: '0.5rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}
          >
            Mi perfil
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 740px) {
          .hide-md { display: none !important; }
          .show-md-only { display: flex !important; }
        }
        @media (min-width: 741px) {
          .show-md-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
