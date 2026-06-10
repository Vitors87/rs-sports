import type { Metadata } from 'next';
import { RouteDetail } from './RouteDetail';

export const metadata: Metadata = {
  title: 'Detalle de ruta | RS Sports',
};

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}>
      <RouteDetail id={id} />
    </main>
  );
}
