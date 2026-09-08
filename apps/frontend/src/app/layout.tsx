import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'KLEBER ERP',
  description: 'Plataforma de gestión de transportes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
