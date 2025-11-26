import { Session } from 'next-auth';

/**
 * Check if user has super admin access (either super_admin or super_admin_viewer)
 */
export function isSuperAdmin(session: Session | null): boolean {
  if (!session || !session.user) return false;
  const role = (session.user as any)?.role;
  return role === 'super_admin' || role === 'super_admin_viewer';
}

/**
 * Check if user can perform delete operations (only full super_admin, not super_admin_viewer)
 */
export function canDelete(session: Session | null): boolean {
  if (!session || !session.user) return false;
  const role = (session.user as any)?.role;
  return role === 'super_admin';
}

/**
 * Get user role from session
 */
export function getUserRole(session: Session | null): string | null {
  if (!session || !session.user) return null;
  return (session.user as any)?.role || null;
}

