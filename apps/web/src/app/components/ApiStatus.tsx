'use client';

import { useCallback, useEffect, useState } from 'react';

interface HealthData {
  status: string;
  service: string;
}

type CheckState = 'idle' | 'loading' | 'ok' | 'error';

// Empty string = relative URL (same origin). Works in production without config.
// Set NEXT_PUBLIC_API_URL to point to a separate API service when needed.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export function ApiStatus() {
  const [state, setState] = useState<CheckState>('idle');
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setState('loading');
    setData(null);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/health`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: HealthData = await res.json();
      setData(json);
      setState('ok');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setState('error');
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const dot = {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 8,
    background:
      state === 'ok' ? '#22c55e' : state === 'error' ? '#ef4444' : '#94a3b8',
  } as const;

  const resultBox = {
    marginTop: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    background: state === 'ok' ? '#f0fdf4' : '#fef2f2',
    border: `1px solid ${state === 'ok' ? '#86efac' : '#fca5a5'}`,
    color: state === 'ok' ? '#166534' : '#991b1b',
  } as const;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={dot} />
          <span style={{ fontSize: '0.95rem', color: '#374151' }}>
            {state === 'idle' && 'Sin verificar'}
            {state === 'loading' && 'Verificando...'}
            {state === 'ok' && `${API_URL}/api/health`}
            {state === 'error' && `No se pudo conectar a ${API_URL}/api/health`}
          </span>
        </div>
        <button
          onClick={check}
          disabled={state === 'loading'}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: state === 'loading' ? '#f3f4f6' : '#fff',
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            color: '#374151',
          }}
        >
          {state === 'loading' ? 'Verificando...' : 'Reintentar'}
        </button>
      </div>

      {state === 'ok' && data && (
        <div style={resultBox}>
          <div>
            <strong>status:</strong> {data.status}
          </div>
          <div>
            <strong>service:</strong> {data.service}
          </div>
        </div>
      )}

      {state === 'error' && (
        <div style={resultBox}>
          <div>
            <strong>Error:</strong> {error}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
            {API_URL
              ? <>Verificar que el servicio API esté corriendo en <code>{API_URL}</code></>
              : <>En local: <code>npm run dev -w apps/api</code></>}
          </div>
        </div>
      )}
    </div>
  );
}
