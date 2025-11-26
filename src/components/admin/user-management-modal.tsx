'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Eye, 
  Edit, 
  Save, 
  UserPlus, 
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react';
import ConfirmationModal from './confirmation-modal';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  subdomainId?: string;
  subdomain?: {
    subdomain: string;
    villageName: string;
    status: string;
  };
  createdAt: string;
}

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'add';
  user?: AdminUser | null;
  onUserUpdated: () => void;
  subdomains: Array<{ id: string; subdomain: string; villageName: string; status: string }>;
}

export default function UserManagementModal({
  isOpen,
  onClose,
  mode,
  user,
  onUserUpdated,
  subdomains
}: UserManagementModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
    subdomainId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Check if current user can delete (only full super_admin)
  const currentUserRole = (session?.user as any)?.role;
  const canDeleteUser = currentUserRole === 'super_admin';
  
  // Check if the user being edited is a restricted role
  const isRestrictedUser = user?.role === 'super_admin' || user?.role === 'super_admin_viewer';

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
        subdomainId: user.subdomainId || ''
      });
    } else if (mode === 'add') {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        isActive: true,
        subdomainId: ''
      });
    }
  }, [mode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'add' 
        ? '/api/super-admin/users'
        : `/api/super-admin/users/${user?.id}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/super-admin/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center">
              {mode === 'view' && <Eye className="h-5 w-5 mr-2" />}
              {mode === 'edit' && <Edit className="h-5 w-5 mr-2" />}
              {mode === 'add' && <UserPlus className="h-5 w-5 mr-2" />}
              {mode === 'view' && 'View User'}
              {mode === 'edit' && 'Edit User'}
              {mode === 'add' && 'Add New User'}
            </CardTitle>
            <CardDescription>
              {mode === 'view' && 'View user details and information'}
              {mode === 'edit' && 'Update user information and permissions'}
              {mode === 'add' && 'Create a new admin user'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {mode === 'view' && user ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Username</Label>
                  <p className="text-lg font-semibold">{user.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Role</Label>
                  <Badge className={`mt-1 ${
                    user.role === 'super_admin' ? 'bg-purple-500' : 
                    user.role === 'super_admin_viewer' ? 'bg-purple-400' :
                    user.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={`mt-1 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Subdomain</Label>
                  <p className="text-lg">
                    {user.subdomain ? (
                      <span className="text-blue-600">
                        {user.subdomain.subdomain}.mahagp.in
                      </span>
                    ) : (
                      <span className="text-gray-400">No subdomain assigned</span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Password {mode === 'edit' && '(leave blank to keep current)'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={mode === 'add'}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="super_admin_viewer">Super Admin Viewer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="subdomainId">Subdomain</Label>
                  <select
                    id="subdomainId"
                    value={formData.subdomainId}
                    onChange={(e) => setFormData({ ...formData, subdomainId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="">No subdomain</option>
                    {subdomains.map((subdomain) => (
                      <option key={subdomain.id} value={subdomain.id}>
                        {subdomain.subdomain}.mahagp.in - {subdomain.villageName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={loading}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                {mode === 'edit' && user && canDeleteUser && !isRestrictedUser && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Delete User
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {mode === 'add' ? 'Create User' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        type="user"
        title="Delete User"
        description="This will permanently delete the user and all associated data."
        itemName={user ? `${user.username} (${user.email})` : ''}
        loading={loading}
      />
    </div>
  );
}
