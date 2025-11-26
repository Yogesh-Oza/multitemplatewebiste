'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InfiniteSelect } from '@/components/ui/infinite-select';
import { 
  Users, 
  Globe, 
  TrendingUp, 
  Activity,
  Shield,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import UserManagementModal from '@/components/admin/user-management-modal';
import SubdomainManagementModal from '@/components/admin/subdomain-management-modal';
import SubdomainRegisterModal from '@/components/admin/subdomain-register-modal';
import ConfirmationModal from '@/components/admin/confirmation-modal';
import { useVillageData } from '@/hooks/useVillageData';

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

interface Subdomain {
  id: string;
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  adminUsername: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

export default function SuperAdminPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subdomains' | 'campaign-forms'>('overview');
  
  // Check if current user can delete (only full super_admin)
  const currentUserRole = (session?.user as any)?.role;
  const canDelete = currentUserRole === 'super_admin';
  
  // Modal states
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: 'view' | 'edit' | 'add';
    user: AdminUser | null;
  }>({
    isOpen: false,
    mode: 'view',
    user: null
  });
  
  const [subdomainModal, setSubdomainModal] = useState<{
    isOpen: boolean;
    mode: 'view' | 'edit' | 'add';
    subdomain: Subdomain | null;
  }>({
    isOpen: false,
    mode: 'view',
    subdomain: null
  });
  
  const [subdomainRegisterModal, setSubdomainRegisterModal] = useState(false);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'user' | 'subdomain';
    title: string;
    description: string;
    itemName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'user',
    title: '',
    description: '',
    itemName: '',
    onConfirm: () => {}
  });
  
  // Search and filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [subdomainSearchTerm, setSubdomainSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [subdomainStatusFilter, setSubdomainStatusFilter] = useState('all');
  // Additional filters for subdomains (API-driven)
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  // Sorting
  const [subdomainSortKey, setSubdomainSortKey] = useState<'createdAt' | 'villageName' | 'subdomain' | 'status'>('createdAt');
  const [subdomainSortDir, setSubdomainSortDir] = useState<'asc' | 'desc'>('desc');
  // Village data for filters (same sources as registration page)
  const {
    districts,
    subDistricts,
    villages,
    loading: villageLoading,
    pagination,
    fetchDistricts,
    fetchSubDistricts,
    fetchVillages,
    clearSubDistricts,
    clearVillages
  } = useVillageData();

  // Infinite select helpers and search terms
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [subDistrictSearchTerm, setSubDistrictSearchTerm] = useState('');
  const [villageSearchTerm, setVillageSearchTerm] = useState('');

  const handleDistrictLoadMore = async () => {
    const nextPage = (pagination?.districts?.page || 1) + 1;
    if (pagination?.districts?.hasMore) {
      await fetchDistricts(nextPage, true, districtSearchTerm);
    }
  };

  const handleSubDistrictLoadMore = async () => {
    if (!selectedDistrictId) return;
    const nextPage = (pagination?.subDistricts?.page || 1) + 1;
    if (pagination?.subDistricts?.hasMore) {
      await fetchSubDistricts(selectedDistrictId, nextPage, true);
    }
  };

  const handleVillageLoadMore = async () => {
    if (!selectedSubDistrictId) return;
    const nextPage = (pagination?.villages?.page || 1) + 1;
    if (pagination?.villages?.hasMore) {
      await fetchVillages(selectedSubDistrictId, villageSearchTerm, nextPage, true);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch admin users
      const usersResponse = await fetch('/api/super-admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setAdminUsers(usersData);
      }

      // Fetch subdomains
      const subdomainsResponse = await fetch('/api/super-admin/subdomains');
      if (subdomainsResponse.ok) {
        const subdomainsData = await subdomainsResponse.json();
        setSubdomains(subdomainsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-500';
      case 'super_admin_viewer': return 'bg-purple-400';
      case 'admin': return 'bg-blue-500';
      case 'editor': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Filter functions
  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Helper: resolve selected names for matching against subdomain records
  const selectedDistrictName = districts.find(d => d.id === selectedDistrictId)?.name || '';
  const selectedSubDistrictName = subDistricts.find(sd => sd.id === selectedSubDistrictId)?.name || '';
  const selectedVillageName = villages.find(v => v.id === selectedVillageId)?.name || '';

  const filteredSubdomains = subdomains.filter(subdomain => {
    const matchesSearch = subdomain.villageName.toLowerCase().includes(subdomainSearchTerm.toLowerCase()) ||
                         subdomain.subdomain.toLowerCase().includes(subdomainSearchTerm.toLowerCase()) ||
                         subdomain.contactPerson.toLowerCase().includes(subdomainSearchTerm.toLowerCase());
    const matchesStatus = subdomainStatusFilter === 'all' || subdomain.status === subdomainStatusFilter;
    const sAny = subdomain as any;
    const matchesDistrict = !selectedDistrictName || (sAny.districtName || '') === selectedDistrictName;
    const matchesSubDistrict = !selectedSubDistrictName || (sAny.subDistrictName || '') === selectedSubDistrictName;
    const matchesVillage = !selectedVillageName || (sAny.villageNameLocal || '') === selectedVillageName;
    return matchesSearch && matchesStatus && matchesDistrict && matchesSubDistrict && matchesVillage;
  });

  const sortedSubdomains = [...filteredSubdomains].sort((a, b) => {
    const dir = subdomainSortDir === 'asc' ? 1 : -1;
    if (subdomainSortKey === 'createdAt') {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return (aTime - bTime) * dir;
    }
    const aVal = (a as any)[subdomainSortKey] || '';
    const bVal = (b as any)[subdomainSortKey] || '';
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  // Modal handlers
  const openUserModal = (mode: 'view' | 'edit' | 'add', user: AdminUser | null = null) => {
    setUserModal({ isOpen: true, mode, user });
  };

  const closeUserModal = () => {
    setUserModal({ isOpen: false, mode: 'view', user: null });
  };

  const openSubdomainModal = (mode: 'view' | 'edit' | 'add', subdomain: Subdomain | null = null) => {
    setSubdomainModal({ isOpen: true, mode, subdomain });
  };

  const closeSubdomainModal = () => {
    setSubdomainModal({ isOpen: false, mode: 'view', subdomain: null });
  };

  const handleUserUpdated = () => {
    fetchData();
  };

  const handleSubdomainUpdated = () => {
    fetchData();
  };

  // Delete confirmation handlers
  const handleDeleteUser = (user: AdminUser) => {
    setConfirmationModal({
      isOpen: true,
      type: 'user',
      title: 'Delete User',
      description: 'This will permanently delete the user and all associated data.',
      itemName: `${user.username} (${user.email})`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/super-admin/users/${user.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || 'Failed to delete user'}`);
            return;
          }

          fetchData();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          alert('An error occurred while deleting the user');
        }
      }
    });
  };

  const handleDeleteSubdomain = (subdomain: Subdomain) => {
    setConfirmationModal({
      isOpen: true,
      type: 'subdomain',
      title: 'Delete Subdomain',
      description: 'This will permanently delete the subdomain and ALL associated data.',
      itemName: `${subdomain.subdomain}.mahagp.in`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/super-admin/subdomains/${subdomain.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || 'Failed to delete subdomain'}`);
            return;
          }

          fetchData();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          alert('An error occurred while deleting the subdomain');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-purple-600" />
                Super Admin Panel
              </h1>
              <p className="text-gray-600 mt-1">Manage users and subdomains</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <Button variant="outline">Back to Site</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="px-6"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('users')}
              className="px-6"
            >
              <Users className="h-4 w-4 mr-2" />
              Users ({adminUsers.length})
            </Button>
            <Button
              variant={activeTab === 'subdomains' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('subdomains')}
              className="px-6"
            >
              <Globe className="h-4 w-4 mr-2" />
              Subdomains ({subdomains.length})
            </Button>
            <Button
              variant={activeTab === 'campaign-forms' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('campaign-forms')}
              className="px-6"
            >
              <FileText className="h-4 w-4 mr-2" />
              Campaign Forms
            </Button>
            <Link href="/super-admin/activity-logs">
              <Button
                variant="ghost"
                className="px-6"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activity Logs
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{adminUsers.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Subdomains</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {subdomains.filter(s => s.isActive).length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Super Admins</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {adminUsers.filter(u => u.role === 'super_admin').length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Subdomains</p>
                      <p className="text-3xl font-bold text-gray-900">{subdomains.length}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Activity className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Recent Subdomains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subdomains.slice(0, 5).map((subdomain) => (
                      <div key={subdomain.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{subdomain.villageName}</p>
                          <p className="text-sm text-gray-500">{subdomain.subdomain}.mahagp.in</p>
                        </div>
                        <Badge className={getStatusColor(subdomain.status)}>
                          {subdomain.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Admin Users</CardTitle>
                  <CardDescription>Manage all admin users and their permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="super_admin_viewer">Super Admin Viewer</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                  {userSearchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Subdomain</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {user.subdomain ? (
                            <span className="text-sm text-gray-600">
                              {user.subdomain.subdomain}.mahagp.in
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No subdomain</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={user.isActive ? 'bg-green-500' : 'bg-red-500'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openUserModal('view', user)}
                              title="View User"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openUserModal('edit', user)}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {canDelete && user.role !== 'super_admin' && user.role !== 'super_admin_viewer' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user)}
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No users found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subdomains Tab */}
        {activeTab === 'subdomains' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subdomains</CardTitle>
                  <CardDescription>Manage all village subdomains</CardDescription>
                </div>
                <Button onClick={() => setSubdomainRegisterModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subdomain
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="mb-6 flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search subdomains by village name or contact..."
                      value={subdomainSearchTerm}
                      onChange={(e) => setSubdomainSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <select
                    value={subdomainStatusFilter}
                    onChange={(e) => setSubdomainStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <InfiniteSelect
                    options={districts.map(d => ({ id: d.id, name: d.name, nameMarathi: d.nameMarathi }))}
                    value={selectedDistrictId}
                    onChange={(value) => {
                      setSelectedDistrictId(value);
                      setSelectedSubDistrictId('');
                      setSelectedVillageId('');
                      clearSubDistricts();
                      clearVillages();
                      if (value) fetchSubDistricts(value);
                    }}
                    placeholder="जिल्हा / District"
                    loading={villageLoading.districts}
                    hasMore={pagination.districts?.hasMore || false}
                    onLoadMore={handleDistrictLoadMore}
                    searchTerm={districtSearchTerm}
                    onSearchChange={(term) => {
                      setDistrictSearchTerm(term);
                      fetchDistricts(1, false, term);
                    }}
                  />
                  <InfiniteSelect
                    options={subDistricts.map(sd => ({ id: sd.id, name: sd.name, nameMarathi: sd.nameMarathi }))}
                    value={selectedSubDistrictId}
                    onChange={(value) => {
                      setSelectedSubDistrictId(value);
                      setSelectedVillageId('');
                      clearVillages();
                      if (value) fetchVillages(value);
                    }}
                    placeholder="तालुका / Sub-District"
                    loading={villageLoading.subDistricts}
                    hasMore={pagination.subDistricts?.hasMore || false}
                    onLoadMore={handleSubDistrictLoadMore}
                    searchTerm={subDistrictSearchTerm}
                    onSearchChange={(term) => {
                      setSubDistrictSearchTerm(term);
                    }}
                    disabled={!selectedDistrictId}
                  />
                  <InfiniteSelect
                    options={villages.map(v => ({ id: v.id, name: v.name, nameMarathi: v.nameMarathi }))}
                    value={selectedVillageId}
                    onChange={(value) => setSelectedVillageId(value)}
                    placeholder="गाव / Village"
                    loading={villageLoading.villages}
                    hasMore={pagination.villages?.hasMore || false}
                    onLoadMore={handleVillageLoadMore}
                    searchTerm={villageSearchTerm}
                    onSearchChange={(term) => {
                      setVillageSearchTerm(term);
                      if (selectedSubDistrictId) fetchVillages(selectedSubDistrictId, term, 1, false);
                    }}
                    disabled={!selectedSubDistrictId}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                  <div className="flex gap-2">
                    <select
                      value={subdomainSortKey}
                      onChange={(e) => setSubdomainSortKey(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="createdAt">Sort by: Created</option>
                      <option value="villageName">Sort by: Village Name</option>
                      <option value="subdomain">Sort by: Subdomain</option>
                      <option value="status">Sort by: Status</option>
                    </select>
                    <select
                      value={subdomainSortDir}
                      onChange={(e) => setSubdomainSortDir(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="asc">Asc</option>
                      <option value="desc">Desc</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {subdomainSearchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubdomainSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubdomainStatusFilter('all');
                        setSelectedDistrictId('');
                        setSelectedSubDistrictId('');
                        setSelectedVillageId('');
                        clearSubDistricts();
                        clearVillages();
                        setSubdomainSearchTerm('');
                        setSubdomainSortKey('createdAt');
                        setSubdomainSortDir('desc');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Village</th>
                      <th className="text-left py-3 px-4">Subdomain</th>
                      <th className="text-left py-3 px-4">Contact</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubdomains.map((subdomain) => (
                      <tr key={subdomain.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{subdomain.villageName}</p>
                            <p className="text-sm text-gray-500">{subdomain.villageNameEn}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-blue-600">
                            {subdomain.subdomain}.mahagp.in
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm">{subdomain.contactPerson}</p>
                            <p className="text-sm text-gray-500">{subdomain.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(subdomain.status)}>
                            {subdomain.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(subdomain.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openSubdomainModal('view', subdomain)}
                              title="View Subdomain"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openSubdomainModal('edit', subdomain)}
                              title="Edit Subdomain"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {canDelete && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteSubdomain(subdomain)}
                                title="Delete Subdomain"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSubdomains.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No subdomains found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Campaign Forms Tab */}
        {activeTab === 'campaign-forms' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Forms</h3>
              <p className="text-gray-500 mb-4">Create and manage flexible campaign forms for village evaluation</p>
              <div className="flex justify-center space-x-4">
                <Link href="/super-admin/campaign-forms">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Forms
                  </Button>
                </Link>
                <Link href="/super-admin/campaign-forms/builder/new">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Form
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={userModal.isOpen}
        onClose={closeUserModal}
        mode={userModal.mode}
        user={userModal.user}
        onUserUpdated={handleUserUpdated}
        subdomains={subdomains.map(s => ({
          id: s.id,
          subdomain: s.subdomain,
          villageName: s.villageName,
          status: s.status
        }))}
      />

      {/* Subdomain Management Modal */}
      <SubdomainManagementModal
        isOpen={subdomainModal.isOpen}
        onClose={closeSubdomainModal}
        mode={subdomainModal.mode}
        subdomain={subdomainModal.subdomain}
        onSubdomainUpdated={handleSubdomainUpdated}
      />

      {/* Subdomain Register Modal */}
      <SubdomainRegisterModal
        isOpen={subdomainRegisterModal}
        onClose={() => setSubdomainRegisterModal(false)}
        onSubdomainCreated={handleSubdomainUpdated}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        type={confirmationModal.type}
        title={confirmationModal.title}
        description={confirmationModal.description}
        itemName={confirmationModal.itemName}
      />
    </div>
  );
}
