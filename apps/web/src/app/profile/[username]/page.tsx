import type { Metadata } from 'next';
import { ProfileContent } from './ProfileContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — RS Sports`,
    description: `Perfil deportivo de ${username} en RS Sports.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="wide-layout">
      <ProfileContent username={username} />
    </div>
  );
}
