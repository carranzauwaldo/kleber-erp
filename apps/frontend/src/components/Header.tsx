'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">KLEBER</div>
          <span className="text-sm text-gray-400">ERP</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
          <Link href="/assets" className="hover:text-blue-400 transition">
            Activos
          </Link>
          <Link href="/trips" className="hover:text-blue-400 transition">
            Viajes
          </Link>
          <Link href="/reports" className="hover:text-blue-400 transition">
            Reportes
          </Link>
        </nav>

        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
          Perfil
        </button>
      </div>
    </header>
  );
}
