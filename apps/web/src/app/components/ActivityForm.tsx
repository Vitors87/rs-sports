'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Sport {
  id: string;
  name: string;
  type: string;
}

interface Props {
  sports: Sport[];
  initialSportId?: string;
  onSuccess: () => void;
}

const INPUT: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: 'var(--r-sm)' as never,
  border: '1.5px solid var(--border)' as never,
  fontSize: '0.88rem',
  color: 'var(--text)' as never,
  background: 'var(--bg)' as never,
  outline: 'none',
};

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--text-3)' as never,
  marginBottom: '0.3rem',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
};

export function ActivityForm({ sports, initialSportId, onSuccess }: Props) {
  const [sportId, setSportId] = useState(initialSportId ?? sports[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [elevation, setElevation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/api/activities', {
        method: 'POST',
        body: JSON.stringify({
          sportId,
          title,
          description: description || undefined,
          distance: distance ? parseFloat(distance) : undefined,
          duration: duration ? parseInt(duration, 10) : undefined,
          elevation: elevation ? parseFloat(elevation) : undefined,
          date,
        }),
      });
      setTitle('');
      setDescription('');
      setDistance('');
      setDuration('');
      setElevation('');
      setDate(new Date().toISOString().slice(0, 10));
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar actividad');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        padding: '1.35rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h2
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '1.1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        Nueva actividad
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div>
          <label style={LABEL}>Deporte</label>
          <select
            value={sportId}
            onChange={(e) => setSportId(e.target.value)}
            style={{ ...INPUT, cursor: 'pointer' }}
            required
          >
            {sports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={LABEL}>Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Carrera del parque"
            style={INPUT}
            required
            maxLength={200}
          />
        </div>

        <div>
          <label style={LABEL}>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Cómo fue la actividad?"
            style={{ ...INPUT, minHeight: 64, resize: 'vertical' }}
            maxLength={1000}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={LABEL}>km</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="0.0"
              style={INPUT}
              min={0}
              step={0.1}
            />
          </div>
          <div>
            <label style={LABEL}>min</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0"
              style={INPUT}
              min={0}
              step={1}
            />
          </div>
          <div>
            <label style={LABEL}>↑ m</label>
            <input
              type="number"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
              placeholder="0"
              style={INPUT}
              step={1}
            />
          </div>
        </div>

        <div>
          <label style={LABEL}>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={INPUT}
            required
          />
        </div>

        {error && (
          <div
            style={{
              padding: '0.55rem 0.8rem',
              borderRadius: 'var(--r-sm)',
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.25)',
              color: '#dc2626',
              fontSize: '0.82rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: 'var(--r)',
            border: 'none',
            background: submitting ? 'var(--text-4)' : 'var(--primary)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            letterSpacing: '0.02em',
          }}
        >
          {submitting ? 'Guardando...' : 'Guardar actividad'}
        </button>
      </div>
    </form>
  );
}
