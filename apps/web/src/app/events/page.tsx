import type { Metadata } from 'next';
import { EventsContent } from './EventsContent';

export const metadata: Metadata = {
  title: 'Eventos — RS Sports',
  description: 'Próximos eventos deportivos de running, ciclismo y trekking en Chile.',
};

export default function EventsPage() {
  return (
    <div className="wide-layout">
      <EventsContent />
    </div>
  );
}
