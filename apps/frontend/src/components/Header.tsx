'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition">
            <Logo />
          </div>
          <div>
            <div className="font-bold text-lg">KLEBER</div>
            <div className="text-xs text-blue-200">Transportes</div>
          </div>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link href="/assets" className="hover:text-blue-200 transition">
              Activos
            </Link>
            <Link href="/trips" className="hover:text-blue-200 transition">
              Viajes
            </Link>
            <Link href="/reports" className="hover:text-blue-200 transition">
              Reportes
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="text-sm text-blue-100">
              {session?.user?.email}
            </div>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
            >
              Salir
            </button>
          ) : (
            <Link href="/login" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
