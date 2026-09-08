import { useSession } from 'next-auth/react';

export function useRbac() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'VIEWER';

  const hasRole = (role: string | string[]): boolean => {
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(userRole);
  };

  const canView = (requiredRoles: string[]): boolean => hasRole(requiredRoles);
  const canEdit = (): boolean => hasRole(['ADMIN', 'MANAGER']);
  const canDelete = (): boolean => hasRole(['ADMIN']);
  const canCreateAssets = (): boolean => hasRole(['ADMIN', 'MANAGER']);
  const canCreateTrips = (): boolean => hasRole(['ADMIN', 'MANAGER', 'DRIVER']);

  return {
    userRole,
    hasRole,
    canView,
    canEdit,
    canDelete,
    canCreateAssets,
    canCreateTrips,
  };
}
