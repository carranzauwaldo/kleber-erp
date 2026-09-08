'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'Error al iniciar sesión');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <div className="text-blue-600">
              <Logo />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          KLEBER ERP
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Plataforma de gestión de transportes
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Demo:</p>
          <p className="text-xs text-gray-600">
            Email: <span className="font-mono">demo@kleber.app</span>
          </p>
          <p className="text-xs text-gray-600">
            Password: <span className="font-mono">Demo123!@</span>
          </p>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
