'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { exportToCSV, exportToJSON } from '@/lib/exportUtils';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalAssets: 0, totalTrips: 0, totalFreight: 0 });
  const [assets, setAssets] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const token = (session?.user as any)?.token;
      const [assetsRes, tripsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const assetsData = assetsRes.data.data || [];
      const tripsData = tripsRes.data.data || [];
      const totalFreight = tripsData.reduce((sum: number, t: any) => sum + (t.freightValue || 0), 0);
      setAssets(assetsData);
      setTrips(tripsData);
      setStats({
        totalAssets: assetsData.length,
        totalTrips: tripsData.length,
        totalFreight,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-500 text-sm font-medium">Total de Activos</div>
          <div className="text-4xl font-bold text-blue-600 mt-2">{stats.totalAssets}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-500 text-sm font-medium">Total de Viajes</div>
          <div className="text-4xl font-bold text-green-600 mt-2">{stats.totalTrips}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-500 text-sm font-medium">Ingresos Totales</div>
          <div className="text-4xl font-bold text-orange-600 mt-2">${stats.totalFreight.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Resumen General</h2>
        <div className="space-y-3 text-gray-600">
          <p>📦 <strong>Activos disponibles:</strong> {stats.totalAssets}</p>
          <p>🚚 <strong>Viajes registrados:</strong> {stats.totalTrips}</p>
          <p>💰 <strong>Ingresos por fletes:</strong> ${stats.totalFreight.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Exportar Datos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => exportToCSV(assets, 'activos')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            📄 Activos CSV
          </button>
          <button onClick={() => exportToJSON(assets, 'activos')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            🔷 Activos JSON
          </button>
          <button onClick={() => exportToCSV(trips, 'viajes')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm">
            📄 Viajes CSV
          </button>
          <button onClick={() => exportToJSON(trips, 'viajes')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm">
            🔷 Viajes JSON
          </button>
        </div>
      </div>
    </div>
  );
}
