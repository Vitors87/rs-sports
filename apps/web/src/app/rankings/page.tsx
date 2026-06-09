import type { Metadata } from 'next';
import { RankingsContent } from './RankingsContent';

export const metadata: Metadata = {
  title: 'Rankings — RS Sports',
  description: 'Top deportistas de running, ciclismo y trekking en RS Sports.',
};

export default function RankingsPage() {
  return (
    <div className="wide-layout">
      <RankingsContent />
    </div>
  );
}
