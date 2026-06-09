import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'rs-sports',
  description: 'Tu red social deportiva outdoor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
