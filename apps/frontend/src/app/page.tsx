'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">KLEBER ERP</h1>
        <p className="text-xl text-blue-100">
          Plataforma modular de gestión de transportes
        </p>
      </section>

      {/* Main Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assets Card */}
        <Link href="/assets">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">🚚</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Activos</h2>
            <p className="text-gray-600">
              Gestiona vehículos, equipos y recursos de tu flota
            </p>
            <div className="mt-4 text-blue-600 font-semibold">
              Ver activos →
            </div>
          </div>
        </Link>

        {/* Trips Card */}
        <Link href="/trips">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Viajes</h2>
            <p className="text-gray-600">
              Registra y monitorea viajes, rutas y entregas
            </p>
            <div className="mt-4 text-blue-600 font-semibold">
              Ver viajes →
            </div>
          </div>
        </Link>

        {/* Reports Card */}
        <Link href="/reports">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Reportes</h2>
            <p className="text-gray-600">
              Visualiza análisis, métricas y rentabilidad
            </p>
            <div className="mt-4 text-blue-600 font-semibold">
              Ver reportes →
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Stats */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Estado General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-gray-600 text-sm">Activos</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-gray-600 text-sm">Viajes Activos</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="text-3xl font-bold text-orange-600">$0</div>
            <p className="text-gray-600 text-sm">Ingresos</p>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="text-3xl font-bold text-purple-600">0%</div>
            <p className="text-gray-600 text-sm">Ocupación</p>
          </div>
        </div>
      </section>
    </div>
  );
}
