'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  LifeBuoy,
  Send,
  CheckCircle2,
  Server,
  RefreshCw,
  Lock,
} from 'lucide-react';
import {
  AdminModuleId,
  AdminRoleDefinition,
  AdminUserRecord,
  AuthenticatedAdminUser,
  ModulePermissionAction,
  RolePermissionsMap,
  SupportTicketRecord,
} from '@/types/admin';
import { SmtpConfigStatus } from '@/lib/server/mailer';

const MODULE_LABELS: { id: AdminModuleId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard & Visitor Map' },
  { id: 'inbox', label: 'Inbox & Email Replies' },
  { id: 'news', label: 'News & Articles' },
  { id: 'products', label: 'Products & Categories' },
  { id: 'teams', label: 'Teams & Leadership' },
  { id: 'media', label: 'Media Library' },
  { id: 'orbit-assistant', label: 'Orbit Assistant & WhatsApp' },
  { id: 'seo', label: 'SEO Management' },
  { id: 'users', label: 'User & Role Management' },
  { id: 'support', label: 'Orbit Support Desk' },
];

const PERMISSION_ACTIONS: ModulePermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
];

function createEmptyPermissions(): RolePermissionsMap {
  return {
    dashboard: ['view'],
    inbox: ['view'],
    news: ['view'],
    products: ['view'],
    teams: ['view'],
    media: ['view'],
    'orbit-assistant': ['view'],
    seo: ['view'],
    users: [],
    support: ['view', 'create'],
  };
}

interface UserManagementModuleProps {
  currentUser: AuthenticatedAdminUser;
  users: AdminUserRecord[];
  roles: AdminRoleDefinition[];
  initialSubTab?: 'users' | 'roles';
  onRefreshStore: (action: string, payload: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;
  onNotify: (msg: string, isError?: boolean) => void;
  onConfirmDelete: (label: string, onConfirm: () => void) => void;
}

export function UserManagementModule({
  currentUser,
  users,
  roles,
  initialSubTab = 'users',
  onRefreshStore,
  onNotify,
  onConfirmDelete,
}: UserManagementModuleProps) {
  const [subTab, setSubTab] = useState<'users' | 'roles'>(initialSubTab);

  React.useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);
  const [searchQuery, setSearchQuery] = useState('');

  // User Modal State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id || 'ROLE-TECH-MANAGER');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<'active' | 'deactivated'>('active');
  const [submitting, setSubmitting] = useState(false);

  // Role Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [rolePerms, setRolePerms] = useState<RolePermissionsMap>(
    createEmptyPermissions
  );

  const canCreate =
    currentUser.roleId === 'ROLE-SUPER-ADMIN' ||
    currentUser.permissions.users?.includes('create');
  const canEdit =
    currentUser.roleId === 'ROLE-SUPER-ADMIN' ||
    currentUser.permissions.users?.includes('edit');
  const canDelete =
    currentUser.roleId === 'ROLE-SUPER-ADMIN' ||
    currentUser.permissions.users?.includes('delete');

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleName.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  });

  const openCreateUser = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRoleId(roles[0]?.id || 'ROLE-SUPER-ADMIN');
    setDepartment('Operations & Administration');
    setStatus('active');
    setUserModalOpen(true);
  };

  const openEditUser = (u: AdminUserRecord) => {
    setEditingUserId(u.id);
    setFullName(u.fullName);
    setEmail(u.email);
    setPassword('');
    setRoleId(u.roleId);
    setDepartment(u.department);
    setStatus(u.status);
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      onNotify('Please provide full name and email address.', true);
      return;
    }
    if (!editingUserId && password.length < 6) {
      onNotify('Initial password must be at least 6 characters.', true);
      return;
    }

    setSubmitting(true);
    const res = await onRefreshStore(
      editingUserId ? 'updateUser' : 'createUser',
      {
        userPayload: {
          id: editingUserId,
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          newPassword: password || undefined,
          roleId,
          department: department.trim(),
          status,
        },
      }
    );
    setSubmitting(false);

    if (!res.ok) {
      onNotify(res.error || 'Failed to save user.', true);
      return;
    }

    setUserModalOpen(false);
    onNotify(editingUserId ? 'User account updated.' : 'New user created.');
  };

  const handleToggleUserStatus = async (u: AdminUserRecord) => {
    const nextStatus = u.status === 'active' ? 'deactivated' : 'active';
    const res = await onRefreshStore('updateUser', {
      userPayload: {
        id: u.id,
        status: nextStatus,
      },
    });
    if (!res.ok) {
      onNotify(res.error || 'Could not update user status.', true);
      return;
    }
    onNotify(
      `User ${u.fullName} is now ${nextStatus === 'active' ? 'active' : 'deactivated'}.`
    );
  };

  const openCreateRole = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    setRolePerms(createEmptyPermissions());
    setRoleModalOpen(true);
  };

  const openEditRole = (r: AdminRoleDefinition) => {
    setEditingRoleId(r.id);
    setRoleName(r.name);
    setRoleDescription(r.description);
    setRolePerms(JSON.parse(JSON.stringify(r.permissions)));
    setRoleModalOpen(true);
  };

  const togglePermission = (
    mod: AdminModuleId,
    action: ModulePermissionAction
  ) => {
    setRolePerms((prev) => {
      const current = prev[mod] || [];
      const exists = current.includes(action);
      let next = exists
        ? current.filter((a) => a !== action)
        : [...current, action];

      // If create/edit/delete is granted, ensure view is also granted
      if (!exists && action !== 'view' && !next.includes('view')) {
        next = ['view', ...next];
      }
      return {
        ...prev,
        [mod]: next,
      };
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      onNotify('Please enter a role name.', true);
      return;
    }
    setSubmitting(true);
    const res = await onRefreshStore('upsertRole', {
      role: {
        id: editingRoleId || `ROLE-${Date.now().toString().slice(-5)}`,
        name: roleName.trim(),
        description:
          roleDescription.trim() || 'Custom administrative role definition.',
        permissions: rolePerms,
      },
    });
    setSubmitting(false);

    if (!res.ok) {
      onNotify(res.error || 'Could not save role.', true);
      return;
    }
    setRoleModalOpen(false);
    onNotify(editingRoleId ? 'Role permissions updated.' : 'Custom role created.');
  };

  return (
    <div className="space-y-6">
      {/* Sub-module Header & Switcher */}
      <div className="bg-white rounded-[24px] border border-brand-border/80 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#FAF9F5] p-1 rounded-xl border border-brand-border">
          <button
            type="button"
            onClick={() => setSubTab('users')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
              subTab === 'users'
                ? 'bg-[#0B0E29] text-white'
                : 'text-brand-muted hover:text-[#0B0E29]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users Directory ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('roles')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold transition-colors ${
              subTab === 'roles'
                ? 'bg-[#0B0E29] text-white'
                : 'text-brand-muted hover:text-[#0B0E29]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Roles &amp; Permissions ({roles.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {subTab === 'users' && (
            <>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] focus:outline-none focus:border-[#0B0E29]"
              />
              {canCreate && (
                <button
                  type="button"
                  onClick={openCreateUser}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
              )}
            </>
          )}

          {subTab === 'roles' && canCreate && (
            <button
              type="button"
              onClick={openCreateRole}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Role</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-MODULE 1: USERS DIRECTORY */}
      {subTab === 'users' && (
        <div className="bg-white rounded-[24px] border border-brand-border/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border/70 bg-[#FAF9F5] text-[11px] font-heading font-bold uppercase tracking-wider text-brand-muted">
                  <th className="py-3.5 px-5">Administrator</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Sign In</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F5]/60">
                    <td className="py-4 px-5">
                      <div className="font-heading font-bold text-[#0B0E29]">
                        {u.fullName}
                      </div>
                      <div className="text-brand-muted">{u.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0E29]/8 text-[#0B0E29] font-heading font-bold text-[11px]">
                        <ShieldCheck className="w-3 h-3 text-brand-orange" />
                        {u.roleName}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-brand-body">{u.department}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-brand-muted">
                      {u.lastLoginAt
                        ? u.lastLoginAt.slice(0, 16).replace('T', ' ')
                        : 'Never'}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u)}
                              className="px-2.5 py-1 rounded-lg border border-brand-border text-[11px] font-semibold text-[#0B0E29] hover:bg-[#FAF9F5]"
                            >
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditUser(u)}
                              className="p-1.5 rounded-lg border border-brand-border text-[#0B0E29] hover:bg-[#FAF9F5]"
                              aria-label={`Edit ${u.fullName}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {canDelete && u.id !== currentUser.id && (
                          <button
                            type="button"
                            onClick={() =>
                              onConfirmDelete(u.fullName, async () => {
                                const res = await onRefreshStore('deleteUser', {
                                  id: u.id,
                                });
                                if (!res.ok) {
                                  onNotify(
                                    res.error || 'Could not delete user.',
                                    true
                                  );
                                } else {
                                  onNotify(`Deleted user ${u.fullName}.`);
                                }
                              })
                            }
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            aria-label={`Delete ${u.fullName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: ROLES & GRANULAR PERMISSIONS */}
      {subTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {roles.map((r) => {
            const assignedUsersCount = users.filter(
              (u) => u.roleId === r.id
            ).length;
            return (
              <div
                key={r.id}
                className="lg:col-span-6 bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-4 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
                          {r.name}
                        </h3>
                        {r.isSystemRole && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-orange/20 text-[#0B0E29] text-[10px] font-heading font-bold">
                            System Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-muted mt-1">
                        {r.description}
                      </p>
                    </div>
                    <span className="text-xs font-heading font-bold text-brand-muted shrink-0">
                      {assignedUsersCount} user{assignedUsersCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  {/* Module Permissions Summary Matrix */}
                  <div className="border border-brand-border/70 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-brand-border/70 text-brand-muted font-heading">
                          <th className="py-2 px-3">Module</th>
                          <th className="py-2 px-2 text-center">View</th>
                          <th className="py-2 px-2 text-center">Create</th>
                          <th className="py-2 px-2 text-center">Edit</th>
                          <th className="py-2 px-2 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/50">
                        {MODULE_LABELS.map((mod) => {
                          const perms = r.permissions?.[mod.id] || [];
                          return (
                            <tr key={mod.id}>
                              <td className="py-1.5 px-3 font-medium text-[#0B0E29]">
                                {mod.label}
                              </td>
                              {PERMISSION_ACTIONS.map((act) => (
                                <td key={act} className="py-1.5 px-2 text-center">
                                  {perms.includes(act) ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                                  ) : (
                                    <span className="text-brand-muted/30">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => openEditRole(r)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-[#0B0E29] hover:bg-[#FAF9F5]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Configure Permissions</span>
                    </button>
                  )}
                  {canDelete && !r.isSystemRole && (
                    <button
                      type="button"
                      onClick={() =>
                        onConfirmDelete(r.name, async () => {
                          const res = await onRefreshStore('deleteRole', {
                            id: r.id,
                          });
                          if (!res.ok) {
                            onNotify(
                              res.error || 'Could not delete role.',
                              true
                            );
                          } else {
                            onNotify(`Deleted role ${r.name}.`);
                          }
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-xs font-heading font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE / EDIT USER */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                {editingUserId ? 'Edit Administrator User' : 'Create Administrator User'}
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-[#0B0E29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Mr Lijalem Abayneh"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@lijemrakel.com"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29] bg-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Executive / Technical / Trade"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    {editingUserId
                      ? 'New Password (leave blank to keep)'
                      : 'Password *'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'active' | 'deactivated')
                    }
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29] bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="deactivated">Deactivated</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ROLE & GRANULAR PERMISSIONS */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-xl my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-extrabold text-[#0B0E29]">
                {editingRoleId
                  ? 'Configure Role & Module Permissions'
                  : 'Create Custom RBAC Role'}
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-[#0B0E29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Veterinary Regulatory Officer"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0E29] mb-1">
                    Role Description
                  </label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Responsibilities and module scope"
                    className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
                  />
                </div>
              </div>

              <div className="border border-brand-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-brand-border font-heading text-[11px] text-brand-muted uppercase">
                      <th className="py-2.5 px-4">Module</th>
                      {PERMISSION_ACTIONS.map((act) => (
                        <th key={act} className="py-2.5 px-3 text-center">
                          {act}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {MODULE_LABELS.map((mod) => {
                      const perms = rolePerms[mod.id] || [];
                      return (
                        <tr key={mod.id} className="hover:bg-[#FAF9F5]/50">
                          <td className="py-2 px-4 font-heading font-bold text-[#0B0E29]">
                            {mod.label}
                          </td>
                          {PERMISSION_ACTIONS.map((act) => {
                            const checked = perms.includes(act);
                            return (
                              <td key={act} className="py-2 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => togglePermission(mod.id, act)}
                                  className="w-4 h-4 rounded accent-[#0B0E29] cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors"
                >
                  {submitting ? 'Saving Role...' : 'Save Role & Permissions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface SupportModuleProps {
  currentUser: AuthenticatedAdminUser;
  supportTickets: SupportTicketRecord[];
  smtpStatus: SmtpConfigStatus | null;
  onTicketSubmitted: (
    tickets: SupportTicketRecord[],
    auditLogs: unknown[]
  ) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function SupportDeskModule({
  currentUser,
  supportTickets,
  smtpStatus,
  onTicketSubmitted,
  onNotify,
}: SupportModuleProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] =
    useState<SupportTicketRecord['category']>('Technical Issue');
  const [priority, setPriority] =
    useState<SupportTicketRecord['priority']>('Normal');
  const [contactEmail, setContactEmail] = useState(currentUser.email);
  const [contactPhone, setContactPhone] = useState('0913514767');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [verifyingSmtp, setVerifyingSmtp] = useState(false);
  const [smtpCheckResult, setSmtpCheckResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const handleVerifySmtp = async () => {
    setVerifyingSmtp(true);
    setSmtpCheckResult(null);
    try {
      const res = await fetch('/api/admin/support?verify=1');
      const data = await res.json();
      if (data.connectionCheck) {
        setSmtpCheckResult(data.connectionCheck);
      }
    } catch {
      setSmtpCheckResult({
        ok: false,
        message: 'Could not reach SMTP verification endpoint.',
      });
    } finally {
      setVerifyingSmtp(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      onNotify('Please enter a subject and support request description.', true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onNotify(data.error || 'Failed to send support request.', true);
        setSending(false);
        return;
      }

      setSubject('');
      setMessage('');
      onTicketSubmitted(data.supportTickets || [], data.auditLogs || []);
      onNotify(
        `Support ticket ${data.ticket?.id} sent to ${data.ticket?.recipientEmail}.`
      );
    } catch {
      onNotify('Network error while sending support ticket.', true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Cols: Professional Support Request Form */}
      <div className="lg:col-span-7 bg-white rounded-[24px] border border-brand-border/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-brand-border/70 pb-5">
          <div>
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-brand-orange">
              Orbit Technical Support Desk
            </span>
            <h3 className="font-heading text-xl font-extrabold text-[#0B0E29] mt-0.5">
              Submit a Support Request
            </h3>
            <p className="text-xs text-brand-muted mt-1">
              Dispatches directly to Orbit Engineering at{' '}
              <strong className="text-[#0B0E29]">
                {smtpStatus?.supportRecipient || 'tekacreative.cloud@gmail.com'}
              </strong>{' '}
              via TLS SMTP ({smtpStatus?.host || 'mail.orbit.et'}:
              {smtpStatus?.port || 465}).
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#0B0E29] text-brand-orange flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
                Support Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as SupportTicketRecord['category']
                  )
                }
                className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29] bg-white"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Email / SMTP Configuration">
                  Email / SMTP Configuration
                </option>
                <option value="Hosting & Domain">Hosting &amp; Domain</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Security & Access">Security &amp; Access</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as SupportTicketRecord['priority']
                  )
                }
                className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29] bg-white"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
                Reply-To Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
                Callback Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your support request"
              className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B0E29] mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue, steps to reproduce, or requested update..."
              className="w-full rounded-xl border border-brand-border px-3.5 py-2.5 text-xs text-[#0B0E29]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="text-[11px] text-brand-muted">
              Recipient:{' '}
              <strong>
                {smtpStatus?.supportRecipient || 'tekacreative.cloud@gmail.com'}
              </strong>
            </span>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-bold transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {sending
                  ? 'Sending via SMTP...'
                  : 'Send Support Request'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Right 5 Cols: SMTP Status & Submitted Support Ticket Log */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-[#0B0E29] text-white rounded-[24px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-brand-orange" />
              <h4 className="font-heading text-sm font-bold">
                SMTP Mail Server Status
              </h4>
            </div>
            <button
              type="button"
              onClick={handleVerifySmtp}
              disabled={verifyingSmtp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-heading font-bold text-white transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${verifyingSmtp ? 'animate-spin' : ''}`}
              />
              <span>{verifyingSmtp ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-xl bg-white/5 p-3">
              <span className="text-white/60 block text-[11px]">SMTP Host</span>
              <span className="font-mono font-bold">
                {smtpStatus?.host || 'mail.orbit.et'}:{smtpStatus?.port || 465}
              </span>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <span className="text-white/60 block text-[11px]">Encryption</span>
              <span className="font-heading font-bold text-brand-orange flex items-center gap-1">
                <Lock className="w-3 h-3" /> Implicit TLS (465)
              </span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 col-span-2">
              <span className="text-white/60 block text-[11px]">
                Authenticated Account
              </span>
              <span className="font-mono font-semibold">
                {smtpStatus?.user || 'technical_support@orbit.et'}
              </span>
            </div>
          </div>

          {smtpCheckResult && (
            <div
              className={`rounded-xl px-3.5 py-2.5 text-xs ${
                smtpCheckResult.ok
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
              }`}
            >
              {smtpCheckResult.message}
            </div>
          )}
        </div>

        {/* Support Ticket History */}
        <div className="bg-white rounded-[24px] border border-brand-border/80 p-6 space-y-4 shadow-2xs">
          <h4 className="font-heading text-sm font-extrabold text-[#0B0E29]">
            Sent Support Tickets ({supportTickets.length})
          </h4>

          {supportTickets.length === 0 ? (
            <p className="text-xs text-brand-muted py-6 text-center">
              No support tickets have been submitted yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-brand-border/70 p-3.5 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[#0B0E29]">
                      {t.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.status}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-[#0B0E29]">
                    {t.subject}
                  </div>
                  <div className="text-brand-muted text-[11px]">
                    {t.category} · {t.priority} Priority · {t.createdAt}
                  </div>
                  <p className="text-brand-body line-clamp-2 pt-1">
                    {t.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
