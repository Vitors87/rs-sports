import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { UserProvider } from '@/contexts/UserContext';

export const metadata: Metadata = {
  title: 'RS Sports — La comunidad outdoor',
  description: 'Red social deportiva para runners, ciclistas y trekkers en Chile.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
