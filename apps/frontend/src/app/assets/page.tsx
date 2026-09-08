'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProtectedByRole } from '@/components/ProtectedByRole';
import { useRbac } from '@/lib/useRbac';

interface Asset {
  id: string;
  name: string;
  type: string;
  licensePlate: string | null;
  status: string;
  createdAt: string;
}

export default function AssetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { canCreateAssets } = useRbac();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'truck', licensePlate: '', status: 'active' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAssets();
    }
  }, [status, router]);

  const fetchAssets = async () => {
    try {
      const token = (session?.user as any)?.token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = (session?.user as any)?.token;
      const organizationId = 'org-demo-1';

      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/assets/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/assets`,
          { ...formData, organizationId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setFormData({ name: '', type: 'truck', licensePlate: '', status: 'active' });
      setShowForm(false);
      setEditingId(null);
      fetchAssets();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (asset: Asset) => {
    setFormData({ name: asset.name, type: asset.type, licensePlate: asset.licensePlate || '', status: asset.status });
    setEditingId(asset.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este activo?')) return;
    try {
      const token = (session?.user as any)?.token;
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssets();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activos</h1>
        <ProtectedByRole roles={['ADMIN', 'MANAGER']}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingId(null);
              setFormData({ name: '', type: 'truck', licensePlate: '', status: 'active' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Activo'}
          </button>
        </ProtectedByRole>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Camión 001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>truck</option>
                <option>van</option>
                <option>car</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: ABC-123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            >
              {editingId ? 'Actualizar' : 'Crear'} Activo
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Placa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay activos
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.licensePlate || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <ProtectedByRole roles={['ADMIN', 'MANAGER']}>
                      <button onClick={() => handleEdit(asset)} className="text-blue-600 hover:text-blue-800 font-semibold">Editar</button>
                    </ProtectedByRole>
                    <ProtectedByRole roles={['ADMIN']}>
                      <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-800 font-semibold">Eliminar</button>
                    </ProtectedByRole>
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
