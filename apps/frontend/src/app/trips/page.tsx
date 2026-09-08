'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProtectedByRole } from '@/components/ProtectedByRole';

interface Trip {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  status: string;
  freightValue: number;
  createdAt: string;
}

export default function TripsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tripNumber: '',
    origin: '',
    destination: '',
    freightValue: '0',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTrips();
    }
  }, [status, router]);

  const fetchTrips = async () => {
    try {
      const token = (session?.user as any)?.token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrips(response.data.data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = (session?.user as any)?.token;
      const organizationId = 'org-demo-1';
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips`,
        { ...formData, freightValue: Number(formData.freightValue), organizationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ tripNumber: '', origin: '', destination: '', freightValue: '0' });
      setShowForm(false);
      fetchTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Viajes</h1>
        <ProtectedByRole roles={['ADMIN', 'MANAGER', 'DRIVER']}>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Viaje'}
          </button>
        </ProtectedByRole>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Viaje</label>
              <input
                type="text"
                required
                value={formData.tripNumber}
                onChange={(e) => setFormData({ ...formData, tripNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: TRIP-001"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Caracas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Valencia"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Flete ($)</label>
              <input
                type="number"
                value={formData.freightValue}
                onChange={(e) => setFormData({ ...formData, freightValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            >
              Crear Viaje
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Viaje #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Origen</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destino</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Flete</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay viajes
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{trip.tripNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trip.origin}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trip.destination}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${trip.freightValue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(trip.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
