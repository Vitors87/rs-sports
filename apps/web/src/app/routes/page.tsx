import type { Metadata } from 'next';
import { RoutesContent } from './RoutesContent';

export const metadata: Metadata = {
  title: 'Rutas outdoor | RS Sports',
  description: 'Descubre rutas de running, ciclismo y trekking en Chile.',
};

export default function RoutesPage() {
  return (
    <main style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}>
      <RoutesContent />
    </main>
  );
}
