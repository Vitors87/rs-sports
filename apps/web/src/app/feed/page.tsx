import type { Metadata } from 'next';
import { FeedContent } from './FeedContent';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';

export const metadata: Metadata = {
  title: 'Feed — RS Sports',
  description: 'Actividades recientes de la comunidad RS Sports. Running, ciclismo y trekking.',
};

export default function FeedPage() {
  return (
    <div className="social-layout">
      <div className="hide-md">
        <LeftSidebar />
      </div>
      <main>
        <FeedContent />
      </main>
      <div className="hide-xl">
        <RightSidebar />
      </div>
    </div>
  );
}
