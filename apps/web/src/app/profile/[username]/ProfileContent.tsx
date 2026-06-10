'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ActivityCard, type ActivityCardData } from '@/components/ActivityCard';

const SPORT_COLOR: Record<string, string> = {
  RUNNING: '#e63946',
  CYCLING: '#f4a261',
  TREKKING: '#457b9d',
};

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface UserData {
  id: string;
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  stats: {
    activities: number;
    followers: number;
    following: number;
    totalKm: number;
  };
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(size * 0.33)}px`,
        fontWeight: 900,
        flexShrink: 0,
        letterSpacing: '0.02em',
        boxShadow: '0 4px 20px rgba(42,157,143,0.4)',
      }}
    >
      {initials}
    </div>
  );
}

export function ProfileContent({ username }: { username: string }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [activities, setActivities] = useState<ActivityCardData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiFetch<{
      user: UserData;
      activities: ActivityCardData[];
      achievements: Achievement[];
      isFollowing: boolean;
      isSelf: boolean;
    }>(`/api/profile/${username}`)
      .then((d) => {
        setUser(d.user);
        setActivities(d.activities);
        setAchievements(d.achievements ?? []);
        setIsFollowing(d.isFollowing ?? false);
        setIsSelf(d.isSelf ?? false);
        setFollowerCount(d.user.stats.followers);
      })
      .catch((e) => {
        if (e.message?.includes('404') || e.message?.includes('no encontrado')) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  async function handleFollow() {
    if (followLoading || isSelf) return;
    setFollowLoading(true);
    const was = isFollowing;
    setIsFollowing(!was);
    setFollowerCount((c) => c + (was ? -1 : 1));
    try {
      const res = await apiFetch<{ following: boolean }>(`/api/users/${username}/follow`, {
        method: 'POST',
      });
      setIsFollowing(res.following);
    } catch {
      setIsFollowing(was);
      setFollowerCount((c) => c + (was ? 1 : -1));
    }
    setFollowLoading(false);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r)', height: 160, border: '1px solid var(--border)', animation: 'rs-pulse 1.4s ease-in-out infinite' }} />
        ))}
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Usuario no encontrado
        </h2>
        <p style={{ color: 'var(--text-3)' }}>@{username} no existe en RS Sports.</p>
      </div>
    );
  }

  const sportCounts: Record<string, number> = {};
  for (const a of activities) {
    sportCounts[a.sport.type] = (sportCounts[a.sport.type] ?? 0) + 1;
  }

  return (
    <>
      {/* Profile header */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Cover */}
        <div
          style={{
            height: 120,
            background: 'linear-gradient(135deg, #0a1628 0%, #0d2b1e 50%, #1a4a3a 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 30% 50%, rgba(42,157,143,0.25) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Info section */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: -40, marginBottom: '1rem' }}>
            <div style={{ border: '4px solid var(--surface)', borderRadius: '50%', flexShrink: 0 }}>
              <Avatar name={user.name} size={80} />
            </div>
            <div style={{ flex: 1, paddingBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {user.name}
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-4)' }}>@{user.username}</p>
            </div>
            {!isSelf && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--r-pill)',
                  background: isFollowing ? 'transparent' : 'var(--primary)',
                  color: isFollowing ? 'var(--primary)' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: '2px solid var(--primary)',
                  cursor: followLoading ? 'wait' : 'pointer',
                  flexShrink: 0,
                  alignSelf: 'center',
                  transition: 'all 0.15s',
                  opacity: followLoading ? 0.7 : 1,
                }}
              >
                {followLoading ? '...' : isFollowing ? '✓ Siguiendo' : 'Seguir'}
              </button>
            )}
          </div>

          {user.bio && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '1.1rem', lineHeight: 1.55 }}>
              {user.bio}
            </p>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Actividades', value: user.stats.activities },
              { label: 'Km totales', value: `${user.stats.totalKm} km` },
              { label: 'Seguidores', value: followerCount },
              { label: 'Siguiendo', value: user.stats.following },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Activities */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Actividades recientes
          </h2>
          {activities.length === 0 ? (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: '2.5rem', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏁</div>
              <p style={{ color: 'var(--text-3)', fontWeight: 500 }}>Sin actividades registradas aún.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Disciplines */}
          {Object.keys(sportCounts).length > 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)', padding: '1.1rem' }}>
              <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.85rem' }}>
                Disciplinas
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(sportCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => {
                    const color = SPORT_COLOR[type] ?? 'var(--primary)';
                    const total = activities.length;
                    return (
                      <div key={type}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                          <span style={{ fontSize: '0.78rem', color, fontWeight: 700 }}>{count} act.</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--bg)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: color, borderRadius: 'var(--r-pill)' }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)', padding: '1.1rem' }}>
            <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.85rem' }}>
              Logros
            </h3>
            {achievements.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-4)', textAlign: 'center', padding: '0.5rem 0' }}>
                Aún no hay logros desbloqueados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {achievements.map(({ icon, title, description }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--primary-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
