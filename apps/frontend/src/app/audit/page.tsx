'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProtectedByRole } from '@/components/ProtectedByRole';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: string | null;
  newValues?: string | null;
  createdAt: string;
}

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLogs();
    }
  }, [status, router]);

  const fetchLogs = async () => {
    try {
      const token = (session?.user as any)?.token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/audit/logs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <ProtectedByRole roles={['ADMIN']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Auditoría</h1>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Acción</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Entidad</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Datos</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay registros
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{log.entityType}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{log.entityId.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {log.newValues ? (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800 text-xs">Ver JSON</summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-sm">
                            {JSON.stringify(JSON.parse(log.newValues), null, 2)}
                          </pre>
                        </details>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedByRole>
  );
}
