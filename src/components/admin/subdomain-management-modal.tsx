'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Eye, 
  Edit, 
  Save, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import ConfirmationModal from './confirmation-modal';

interface Subdomain {
  id: string;
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  isActive: boolean;
  adminUsername: string;
  createdAt: string;
}

interface SubdomainManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'add';
  subdomain?: Subdomain | null;
  onSubdomainUpdated: () => void;
}

export default function SubdomainManagementModal({
  isOpen,
  onClose,
  mode,
  subdomain,
  onSubdomainUpdated
}: SubdomainManagementModalProps) {
  const [formData, setFormData] = useState({
    subdomain: '',
    villageName: '',
    villageNameEn: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    isActive: true,
    adminUsername: 'admin',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && subdomain) {
      setFormData({
        subdomain: subdomain.subdomain,
        villageName: subdomain.villageName,
        villageNameEn: subdomain.villageNameEn,
        contactPerson: subdomain.contactPerson,
        email: subdomain.email,
        phone: subdomain.phone,
        address: subdomain.address,
        status: subdomain.status,
        isActive: subdomain.isActive,
        adminUsername: subdomain.adminUsername,
        adminPassword: ''
      });
    } else if (mode === 'add') {
      setFormData({
        subdomain: '',
        villageName: '',
        villageNameEn: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        isActive: true,
        adminUsername: 'admin',
        adminPassword: ''
      });
    }
  }, [mode, subdomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'add' 
        ? '/api/super-admin/subdomains'
        : `/api/super-admin/subdomains/${subdomain?.id}`;
      
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
        throw new Error(errorData.error || 'Failed to save subdomain');
      }

      onSubdomainUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!subdomain) return;
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!subdomain) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/super-admin/subdomains/${subdomain.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subdomain');
      }

      onSubdomainUpdated();
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center">
              {mode === 'view' && <Eye className="h-5 w-5 mr-2" />}
              {mode === 'edit' && <Edit className="h-5 w-5 mr-2" />}
              {mode === 'add' && <Globe className="h-5 w-5 mr-2" />}
              {mode === 'view' && 'View Subdomain'}
              {mode === 'edit' && 'Edit Subdomain'}
              {mode === 'add' && 'Add New Subdomain'}
            </CardTitle>
            <CardDescription>
              {mode === 'view' && 'View subdomain details and information'}
              {mode === 'edit' && 'Update subdomain information and settings'}
              {mode === 'add' && 'Create a new village subdomain'}
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

          {mode === 'view' && subdomain ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Village Name</Label>
                    <p className="text-lg font-semibold">{subdomain.villageName}</p>
                    <p className="text-sm text-gray-500">{subdomain.villageNameEn}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Subdomain</Label>
                    <p className="text-lg font-mono text-blue-600">
                      {subdomain.subdomain}.mahagp.in
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={`mt-1 ${
                      subdomain.status === 'active' ? 'bg-green-500' : 
                      subdomain.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {subdomain.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Active</Label>
                    <Badge className={`mt-1 ${subdomain.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                      {subdomain.isActive ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <p className="text-lg">{subdomain.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg">{subdomain.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-lg">{subdomain.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="text-lg">{subdomain.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Admin Username</Label>
                    <p className="text-lg font-mono">{subdomain.adminUsername}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created</Label>
                    <p className="text-lg">{new Date(subdomain.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    placeholder="village-name"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Will be accessible at {formData.subdomain || 'village-name'}.mahagp.in</p>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="villageName">Village Name (Marathi)</Label>
                  <Input
                    id="villageName"
                    value={formData.villageName}
                    onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="villageNameEn">Village Name (English)</Label>
                  <Input
                    id="villageNameEn"
                    value={formData.villageNameEn}
                    onChange={(e) => setFormData({ ...formData, villageNameEn: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="adminUsername">Admin Username</Label>
                  <Input
                    id="adminUsername"
                    value={formData.adminUsername}
                    onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                {mode === 'add' && (
                  <div>
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    disabled={loading}
                    rows={3}
                  />
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
                {mode === 'edit' && subdomain && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Delete Subdomain
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
                  {mode === 'add' ? 'Create Subdomain' : 'Save Changes'}
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
        type="subdomain"
        title="Delete Subdomain"
        description="This will permanently delete the subdomain and ALL associated data."
        itemName={subdomain ? `${subdomain.subdomain}.mahagp.in` : ''}
        loading={loading}
      />
    </div>
  );
}
