'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  Download, 
  Search, 
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar
} from 'lucide-react';
import { useVillageData } from '@/hooks/useVillageData';
import { InfiniteSelect } from '@/components/ui/infinite-select';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  action: string;
  model: string;
  modelId: string;
  userName: string;
  userEmail: string;
  subdomainName: string | null;
  villageName: string | null;
  districtName: string | null;
  subDistrictName: string | null;
  description: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const ACTION_TYPES = ['CREATE', 'UPDATE', 'DELETE'];
const MODEL_TYPES = [
  'Announcement',
  'Program',
  'Gallery',
  'HeroImage',
  'Leader',
  'ProgressMetric',
  'NewsItem',
  'DailyMessage',
  'HistoryCard',
  'TimelineItem',
  'CulturalHeritage',
  'Facility',
  'Contact',
  'Department',
  'GovernmentScheme',
  'GovernmentResolution',
  'Project',
  'IncomeExpense',
  'VillageInfo',
  'HomepageSettings',
  'QRCodeSettings',
  'FooterContent',
  'DashboardMetric',
  'TeamMember',
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Village data for filters
  const {
    districts,
    subDistricts,
    loading: villageLoading,
    pagination: villagePagination,
    fetchDistricts,
    fetchSubDistricts,
    clearSubDistricts,
  } = useVillageData();

  // Search terms for infinite select
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [subDistrictSearchTerm, setSubDistrictSearchTerm] = useState('');

  const fetchLogs = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);

      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (userName) params.set('userName', userName);
      if (userEmail) params.set('userEmail', userEmail);
      if (selectedAction) params.set('action', selectedAction);
      if (selectedModel) params.set('model', selectedModel);

      // Get district/subdistrict names from IDs
      const selectedDistrictName = districts.find(d => d.id === selectedDistrictId)?.name;
      const selectedSubDistrictName = subDistricts.find(sd => sd.id === selectedSubDistrictId)?.name;

      if (selectedDistrictName) params.set('districtName', selectedDistrictName);
      if (selectedSubDistrictName) params.set('subDistrictName', selectedSubDistrictName);

      const response = await fetch(`/api/super-admin/activity-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, userName, userEmail, selectedDistrictId, selectedSubDistrictId, selectedAction, selectedModel, sortBy, sortOrder, districts, subDistricts]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleExport = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();

      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (userName) params.set('userName', userName);
      if (userEmail) params.set('userEmail', userEmail);
      if (selectedAction) params.set('action', selectedAction);
      if (selectedModel) params.set('model', selectedModel);

      const selectedDistrictName = districts.find(d => d.id === selectedDistrictId)?.name;
      const selectedSubDistrictName = subDistricts.find(sd => sd.id === selectedSubDistrictId)?.name;

      if (selectedDistrictName) params.set('districtName', selectedDistrictName);
      if (selectedSubDistrictName) params.set('subDistrictName', selectedSubDistrictName);

      const response = await fetch(`/api/super-admin/activity-logs/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to export logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Failed to export activity logs');
    } finally {
      setDownloading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setUserName('');
    setUserEmail('');
    setSelectedDistrictId('');
    setSelectedSubDistrictId('');
    setSelectedAction('');
    setSelectedModel('');
    clearSubDistricts();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-500';
      case 'UPDATE':
        return 'bg-blue-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Activity className="h-8 w-8 mr-3 text-purple-600" />
                Activity Logs
              </h1>
              <p className="text-gray-600 mt-1">Monitor all admin activities across villages</p>
            </div>
            <Button onClick={handleExport} disabled={downloading}>
              <Download className="h-4 w-4 mr-2" />
              {downloading ? 'Exporting...' : 'Export to Excel'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* User Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">User Name</label>
                <Input
                  placeholder="Search by name..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">User Email</label>
                <Input
                  placeholder="Search by email..."
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              {/* Location Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <InfiniteSelect
                  options={districts.map(d => ({ id: d.id, name: d.name, nameMarathi: d.nameMarathi }))}
                  value={selectedDistrictId}
                  onChange={(value) => {
                    setSelectedDistrictId(value);
                    setSelectedSubDistrictId('');
                    clearSubDistricts();
                    if (value) fetchSubDistricts(value);
                  }}
                  placeholder="Select District"
                  loading={villageLoading.districts}
                  hasMore={villagePagination.districts?.hasMore || false}
                  onLoadMore={() => {
                    const nextPage = (villagePagination.districts?.page || 1) + 1;
                    if (villagePagination.districts?.hasMore) {
                      fetchDistricts(nextPage, true, districtSearchTerm);
                    }
                  }}
                  searchTerm={districtSearchTerm}
                  onSearchChange={(term) => {
                    setDistrictSearchTerm(term);
                    fetchDistricts(1, false, term);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-District</label>
                <InfiniteSelect
                  options={subDistricts.map(sd => ({ id: sd.id, name: sd.name, nameMarathi: sd.nameMarathi }))}
                  value={selectedSubDistrictId}
                  onChange={(value) => setSelectedSubDistrictId(value)}
                  placeholder="Select Sub-District"
                  loading={villageLoading.subDistricts}
                  hasMore={villagePagination.subDistricts?.hasMore || false}
                  onLoadMore={() => {
                    if (!selectedDistrictId) return;
                    const nextPage = (villagePagination.subDistricts?.page || 1) + 1;
                    if (villagePagination.subDistricts?.hasMore) {
                      fetchSubDistricts(selectedDistrictId, nextPage, true);
                    }
                  }}
                  searchTerm={subDistrictSearchTerm}
                  onSearchChange={(term) => setSubDistrictSearchTerm(term)}
                  disabled={!selectedDistrictId}
                />
              </div>

              {/* Action and Model Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Actions</option>
                  {ACTION_TYPES.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Models</option>
                  {MODEL_TYPES.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Showing {logs.length} of {pagination.total} logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No activity logs found matching your criteria.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('createdAt')}
                        >
                          <div className="flex items-center">
                            Date/Time
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('action')}
                        >
                          <div className="flex items-center">
                            Action
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('model')}
                        >
                          <div className="flex items-center">
                            Model
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Village</th>
                        <th className="text-left py-3 px-4">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {log.model}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {log.description}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm font-medium">{log.userName}</div>
                              <div className="text-xs text-gray-500">{log.userEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {log.villageName || '-'}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div>
                              {log.districtName && <div>{log.districtName}</div>}
                              {log.subDistrictName && (
                                <div className="text-xs text-gray-500">{log.subDistrictName}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(pagination.page - 1)}
                      disabled={!pagination.hasPreviousPage || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(pagination.page + 1)}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

