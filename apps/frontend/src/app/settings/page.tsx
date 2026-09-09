'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ErrorToast, SuccessToast } from '@/components/ErrorToast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [setupStep, setSetupStep] = useState<'idle' | 'display' | 'verify'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSetup2FA = async () => {
    try {
      const token = (session?.user as any)?.token;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/2fa/setup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQrCode(res.data.data.qrCode);
      setSecret(res.data.data.secret);
      setBackupCodes(res.data.data.backupCodes);
      setSetupStep('display');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error setting up 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      const token = (session?.user as any)?.token;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/2fa/enable`,
        { secret, token: verifyCode, backupCodes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('2FA habilitada exitosamente');
      setSetupStep('idle');
      setTimeout(() => {
        setQrCode('');
        setSecret('');
        setBackupCodes([]);
        setVerifyCode('');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error verifying 2FA');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Configuración</h1>

      {error && <ErrorToast message={error} onClose={() => setError('')} />}
      {success && <SuccessToast message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Autenticación de Dos Factores</h2>

        {setupStep === 'idle' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Aumenta la seguridad de tu cuenta habilitando autenticación de dos factores.
            </p>
            <button
              onClick={handleSetup2FA}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Configurar 2FA
            </button>
          </div>
        )}

        {setupStep === 'display' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              1. Escanea este código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc)
            </p>
            <div className="flex justify-center mb-6">
              <img src={qrCode} alt="QR Code" className="border-2 border-gray-300 p-2" />
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-xs text-gray-600 mb-2">Código secreto (guárdalo seguro):</p>
              <code className="font-mono text-sm bg-white p-2 rounded block">{secret}</code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Códigos de respaldo:</p>
              <div className="space-y-1">
                {backupCodes.map((code) => (
                  <code key={code} className="block text-xs font-mono text-yellow-900">
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">Guarda estos códigos en un lugar seguro</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa un código de tu aplicador para verificar:
              </label>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleVerify2FA}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
              >
                Verificar y Activar
              </button>
              <button
                onClick={() => setSetupStep('idle')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
