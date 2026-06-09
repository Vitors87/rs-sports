import type { Metadata } from 'next';
import { GroupsContent } from './GroupsContent';

export const metadata: Metadata = {
  title: 'Comunidades — RS Sports',
  description: 'Únete a comunidades de runners, ciclistas y trekkers en RS Sports.',
};

export default function GroupsPage() {
  return (
    <div className="wide-layout">
      <GroupsContent />
    </div>
  );
}
