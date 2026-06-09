import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RS Sports — Red social deportiva',
  description: 'Registra tus actividades de running, ciclismo y trekking. Comparte con la comunidad outdoor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
