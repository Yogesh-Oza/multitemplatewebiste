'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Calendar,
  Users,
  FileText,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CampaignForm {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  formMetadata: {
    campaignName?: string;
    year?: string;
    formType?: string;
  };
  maxPossibleTotal: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  sections: any[];
  submissions: any[];
  _count: {
    sections: number;
    submissions: number;
  };
}

export default function CampaignFormsPage() {
  const [forms, setForms] = useState<CampaignForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchForms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/super-admin/campaign-forms?${params}`);
      const data = await response.json();

      if (response.ok) {
        setForms(data.forms);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [pagination.page, searchTerm, statusFilter]);

  const handleDelete = async (formId: string, formName: string) => {
    if (!confirm(`Are you sure you want to delete "${formName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${formId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Form deleted successfully');
        fetchForms();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const handleDuplicate = async (form: CampaignForm) => {
    try {
      const response = await fetch('/api/super-admin/campaign-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.name} (Copy)`,
          nameEn: `${form.nameEn} (Copy)`,
          description: form.description,
          descriptionEn: form.description,
          formMetadata: form.formMetadata,
          maxPossibleTotal: form.maxPossibleTotal,
          isActive: false,
          isDefault: false
        })
      });

      if (response.ok) {
        toast.success('Form duplicated successfully');
        fetchForms();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to duplicate form');
      }
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error('Failed to duplicate form');
    }
  };

  const getStatusBadge = (form: CampaignForm) => {
    if (form.isDefault) {
      return <Badge variant="default">Default</Badge>;
    }
    if (form.isActive) {
      return <Badge variant="secondary">Active</Badge>;
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading campaign forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaign Forms</h1>
          <p className="text-muted-foreground">
            Manage campaign forms for village evaluation
          </p>
        </div>
        <Link href="/super-admin/campaign-forms/builder/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Form
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Campaign Forms</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first campaign form
              </p>
              <Link href="/super-admin/campaign-forms/builder/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Form
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <CardDescription>{form.nameEn}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(form)}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Form Metadata */}
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3" />
                      {form.formMetadata.year || 'No year set'}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3 w-3" />
                      {form.formMetadata.campaignName || 'No campaign name'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {form._count.submissions} submissions
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <span>Sections: {form._count.sections}</span>
                    <span>Max Marks: {form.maxPossibleTotal}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/super-admin/campaign-forms/builder/${form.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(form)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(form.id, form.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
