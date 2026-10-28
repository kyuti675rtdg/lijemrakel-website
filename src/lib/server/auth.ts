import { NextRequest } from 'next/server';
import {
  AdminModuleId,
  AuthenticatedAdminUser,
  ModulePermissionAction,
} from '@/types/admin';
import { verifySessionToken } from '@/lib/server/crypto';
import { readDb } from '@/lib/server/db';

export const SESSION_COOKIE_NAME = 'lijemrakel_admin_token';

export function getAuthenticatedUserFromRequest(
  req: NextRequest
): AuthenticatedAdminUser | null {
  const tokenCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!tokenCookie) return null;

  const payload = verifySessionToken(tokenCookie);
  if (!payload) return null;

  const db = readDb();
  const user = db.users.find(
    (u) =>
      u.id === payload.userId ||
      u.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (!user || user.status !== 'active') {
    return null;
  }

  const role =
    db.roles.find((r) => r.id === user.roleId) ||
    db.roles.find((r) => r.id === 'ROLE-SUPER-ADMIN') ||
    db.roles[0];

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    roleId: role.id,
    roleName: role.name,
    status: user.status,
    department: user.department,
    permissions: role.permissions,
    lastLoginAt: user.lastLoginAt,
  };
}

export function hasModulePermission(
  user: AuthenticatedAdminUser | null,
  module: AdminModuleId,
  action: ModulePermissionAction
): boolean {
  if (!user || user.status !== 'active') return false;
  if (user.roleId === 'ROLE-SUPER-ADMIN') return true;
  const modulePerms = user.permissions?.[module] || [];
  return modulePerms.includes(action);
}
