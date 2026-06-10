'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';

const SPORT_GRAD: Record<string, string> = {
  RUNNING:  'linear-gradient(135deg, #e63946 0%, #b71c2b 100%)',
  CYCLING:  'linear-gradient(135deg, #f4a261 0%, #d97b34 100%)',
  TREKKING: 'linear-gradient(135deg, #457b9d 0%, #2d607e 100%)',
};

const SPORT_EMOJI: Record<string, string> = {
  RUNNING: '🏃',
  CYCLING: '🚴',
  TREKKING: '🥾',
};

export interface ActivityCardData {
  id: string;
  title: string;
  description?: string | null;
  distance?: number | null;
  duration?: number | null;
  elevation?: number | null;
  date: string;
  user: { name: string; username: string };
  sport: { name: string; type: string };
  commentCount?: number;
}

interface ApiComment {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; username: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 6) return new Date(dateStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  if (d > 0) return `hace ${d}d`;
  if (h > 0) return `hace ${h}h`;
  if (m > 0) return `hace ${m}m`;
  return 'ahora';
}

function Avatar({ name, size = 38 }: { name: string; size?: number }) {
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
        fontSize: `${Math.round(size * 0.32)}px`,
        fontWeight: 800,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  );
}

export function ActivityCard({ activity }: { activity: ActivityCardData }) {
  const grad = SPORT_GRAD[activity.sport.type] ?? 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
  const emoji = SPORT_EMOJI[activity.sport.type] ?? '🏅';

  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentCount, setCommentCount] = useState(activity.commentCount ?? 0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const data = await apiFetch<{ comments: ApiComment[] }>(`/api/activities/${activity.id}/comments`);
      setComments(data.comments);
      setCommentCount(data.comments.length);
      setCommentsLoaded(true);
    } catch {
      // keep previous state
    } finally {
      setCommentsLoading(false);
    }
  }, [activity.id]);

  function handleToggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      loadComments();
    }
    if (next) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    setCommentError('');
    try {
      const res = await apiFetch<{ comment: ApiComment }>(`/api/activities/${activity.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: text }),
      });
      setComments((prev) => [...prev, res.comment]);
      setCommentCount((c) => c + 1);
      setCommentText('');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Error al guardar el comentario');
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    const text = `${activity.title} — ${activity.user.name} | RS Sports`;
    try { navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  }

  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Sport banner */}
      <div
        style={{
          height: 76,
          background: grad,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 1.25rem',
        }}
      >
        <div style={{ position: 'absolute', top: -24, right: 64, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', top: -12, right: 18, width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 16, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)' }}>
          {activity.sport.name}
        </div>
        <span style={{ fontSize: '2.25rem', position: 'relative', zIndex: 1 }}>{emoji}</span>
      </div>

      <div style={{ padding: '1rem 1.15rem 0.8rem' }}>
        {/* User header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.7rem' }}>
          <Link href={`/profile/${activity.user.username}`} style={{ flexShrink: 0 }}>
            <Avatar name={activity.user.name} />
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link
              href={`/profile/${activity.user.username}`}
              style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.2, display: 'block' }}
            >
              {activity.user.name}
            </Link>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-4)' }}>
              <Link href={`/profile/${activity.user.username}`} style={{ color: 'var(--text-4)' }}>
                @{activity.user.username}
              </Link>
              {' · '}{timeAgo(activity.date)}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text)', marginBottom: activity.description ? '0.3rem' : '0.7rem', lineHeight: 1.3 }}>
          {activity.title}
        </h3>

        {activity.description && (
          <p style={{ fontSize: '0.84rem', color: 'var(--text-3)', marginBottom: '0.7rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {activity.description}
          </p>
        )}

        {/* Metrics */}
        {(activity.distance != null || activity.duration != null || activity.elevation != null) && (
          <div style={{ display: 'flex', gap: '1.5rem', padding: '0.6rem 0 0.7rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '0.7rem' }}>
            {activity.distance != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{activity.distance.toFixed(1)}</div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>km</div>
              </div>
            )}
            {activity.duration != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{activity.duration}</div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>min</div>
              </div>
            )}
            {activity.elevation != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{activity.elevation}</div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>m ↑</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.15rem' }}>
          <button
            onClick={() => setLiked(!liked)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.7rem', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', fontWeight: liked ? 600 : 500, color: liked ? '#e63946' : 'var(--text-3)', background: liked ? 'rgba(230,57,70,0.08)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.14s' }}
          >
            {liked ? '❤️' : '🤍'} Me gusta
          </button>

          <button
            onClick={handleToggleComments}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.7rem', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', fontWeight: showComments ? 600 : 500, color: showComments ? 'var(--primary)' : 'var(--text-3)', background: showComments ? 'var(--primary-glow)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.14s' }}
          >
            💬 {commentCount > 0 ? commentCount : 'Comentar'}
          </button>

          <button
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.7rem', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', fontWeight: 500, color: shared ? 'var(--primary)' : 'var(--text-3)', background: shared ? 'var(--primary-glow)' : 'transparent', border: 'none', cursor: 'pointer', marginLeft: 'auto', transition: 'all 0.14s' }}
          >
            {shared ? '✓ Copiado' : '↗ Compartir'}
          </button>
        </div>
      </div>

      {/* Comments panel */}
      {showComments && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '0.85rem 1.15rem', background: 'rgba(0,0,0,0.03)' }}>
          {/* Loading */}
          {commentsLoading && (
            <div style={{ textAlign: 'center', padding: '0.75rem 0', fontSize: '0.82rem', color: 'var(--text-4)' }}>
              Cargando comentarios...
            </div>
          )}

          {/* Comment list */}
          {!commentsLoading && comments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.85rem' }}>
              {comments.map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Link href={`/profile/${c.user.username}`} style={{ flexShrink: 0 }}>
                    <Avatar name={c.user.name} size={28} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-sm)', padding: '0.4rem 0.7rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginRight: '0.4rem' }}>
                        {c.user.name}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.45 }}>
                        {c.content}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-4)', marginTop: '0.2rem', paddingLeft: '0.5rem' }}>
                      {timeAgo(c.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty comments state */}
          {!commentsLoading && commentsLoaded && comments.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', textAlign: 'center', padding: '0.5rem 0 0.85rem' }}>
              Sin comentarios aún. ¡Sé el primero!
            </p>
          )}

          {/* Input */}
          <form onSubmit={handleSubmitComment} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Avatar name="Demo Runner" size={28} />
            <input
              ref={inputRef}
              value={commentText}
              onChange={(e) => { setCommentText(e.target.value); setCommentError(''); }}
              placeholder="Escribe un comentario..."
              maxLength={500}
              disabled={submitting}
              style={{
                flex: 1,
                background: 'var(--surface)',
                border: `1px solid ${commentError ? 'rgba(220,38,38,0.5)' : 'var(--border)'}`,
                borderRadius: 'var(--r-pill)',
                padding: '0.4rem 0.9rem',
                fontSize: '0.82rem',
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--r-pill)',
                background: commentText.trim() && !submitting ? 'var(--primary)' : 'var(--border)',
                color: commentText.trim() && !submitting ? '#fff' : 'var(--text-4)',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: commentText.trim() && !submitting ? 'pointer' : 'default',
                transition: 'all 0.14s',
                flexShrink: 0,
              }}
            >
              {submitting ? '...' : 'Enviar'}
            </button>
          </form>

          {commentError && (
            <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.35rem', paddingLeft: '2.25rem' }}>
              {commentError}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
