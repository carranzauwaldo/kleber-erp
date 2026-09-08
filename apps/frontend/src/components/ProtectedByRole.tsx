'use client';

import { useRbac } from '@/lib/useRbac';
import { ReactNode } from 'react';

interface ProtectedByRoleProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedByRole({ roles, children, fallback }: ProtectedByRoleProps) {
  const { canView } = useRbac();

  if (!canView(roles)) {
    return fallback || <div className="text-center text-gray-500 py-8">Acceso denegado</div>;
  }

  return <>{children}</>;
}
