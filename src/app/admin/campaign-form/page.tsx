'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdminContext } from '@/components/providers/admin-context';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CampaignForm {
  id: string;
  name: string;
  nameEn: string;
  formMetadata: {
    campaignName?: string;
    year?: string;
    formType?: string;
  };
  maxPossibleTotal: number;
  sections: any[];
}

interface Submission {
  id: string;
  status: string;
  totalMarks: number;
  totalMaxMarks: number;
  submittedAt?: string;
  basicInfo: any;
  summary: any;
}

export default function CampaignFormDashboard() {
  const { subdomainId } = useAdminContext();
  const [campaignForm, setCampaignForm] = useState<CampaignForm | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [basicInfoComplete, setBasicInfoComplete] = useState(false);

  useEffect(() => {
    fetchData();
  }, [subdomainId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Wait for subdomainId to be available
      if (!subdomainId) {
        console.log('Waiting for subdomainId...');
        return;
      }
      
      // Get the default campaign form
      const formResponse = await fetch('/api/super-admin/campaign-forms');
      const formData = await formResponse.json();
      
      if (formResponse.ok && formData.forms.length > 0) {
        const defaultForm = formData.forms.find((form: any) => form.isDefault) || formData.forms[0];
        setCampaignForm(defaultForm);

        // Get submission for this form using the actual subdomainId
        const submissionResponse = await fetch(`/api/campaign-form/submission?subdomainId=${subdomainId}&campaignFormId=${defaultForm.id}`);
        const submissionData = await submissionResponse.json();
        
        if (submissionResponse.ok && submissionData.submission) {
          setSubmission(submissionData.submission);
          setBasicInfoComplete(!!submissionData.submission.basicInfo?.grampanchayatName);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load campaign form data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="default" className="bg-green-500">Submitted</Badge>;
      case 'verified':
        return <Badge variant="default" className="bg-blue-500">Verified</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-purple-500">Approved</Badge>;
      case 'draft':
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getCompletionPercentage = () => {
    if (!submission || !campaignForm) return 0;
    return Math.round((submission.totalMarks / campaignForm.maxPossibleTotal) * 100);
  };

  const getSectionProgress = () => {
    if (!campaignForm || !submission) return [];
    
    return campaignForm.sections.map((section: any) => {
      const sectionMarks = Number(submission.summary?.sectionTotals?.[section.id]) || 0;
      const percentage = section.maxMarks > 0 ? Math.round((sectionMarks / section.maxMarks) * 100) : 0;
      
      return {
        id: section.id,
        title: section.title,
        titleEn: section.titleEn,
        maxMarks: section.maxMarks,
        achievedMarks: sectionMarks,
        percentage
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading campaign form...</p>
        </div>
      </div>
    );
  }

  if (!campaignForm) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Campaign Form Available</h3>
        <p className="text-muted-foreground">
          Please contact the administrator to set up a campaign form.
        </p>
      </div>
    );
  }

  const sectionProgress = getSectionProgress();
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{campaignForm.name}</h1>
          <p className="text-muted-foreground">{campaignForm.nameEn}</p>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(submission?.status || 'draft')}
            <Badge variant="outline">
              {campaignForm.formMetadata.year || '2025-2026'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {submission && (
            <Link href="/admin/campaign-form/form">
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                {submission.status === 'draft' ? 'Continue Form' : 'View Form'}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={completionPercentage} className="flex-1" />
              <span className="text-sm text-muted-foreground">
                {submission?.totalMarks || 0} / {campaignForm.maxPossibleTotal}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {basicInfoComplete ? 'Complete' : 'Pending'}
            </div>
            <p className="text-xs text-muted-foreground">
              {basicInfoComplete ? 'All basic info provided' : 'Basic info required'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submission ? 'Started' : 'Not Started'}
            </div>
            <p className="text-xs text-muted-foreground">
              {submission?.submittedAt ? 
                `Submitted on ${new Date(submission.submittedAt).toLocaleDateString()}` : 
                'Form not yet started'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Section-wise Progress</CardTitle>
          <CardDescription>
            Track your progress across different sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionProgress.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{section.title}</h4>
                    <p className="text-sm text-muted-foreground">{section.titleEn}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{section.percentage}%</div>
                    <div className="text-sm text-muted-foreground">
                      {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks} marks
                    </div>
                  </div>
                </div>
                <Progress value={section.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide village basic information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {basicInfoComplete ? 
                'Basic information has been completed.' : 
                'Please provide basic village information before filling the form.'
              }
            </p>
            <Link href="/admin/campaign-form/basic-info">
              <Button variant={basicInfoComplete ? "outline" : "default"} className="w-full">
                {basicInfoComplete ? 'Update Information' : 'Fill Basic Information'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaign Form
            </CardTitle>
            <CardDescription>
              Fill the campaign evaluation form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {submission ? 
                'Continue filling the campaign form.' : 
                'Start filling the campaign form to evaluate your village.'
              }
            </p>
            <Link href="/admin/campaign-form/form">
              <Button variant={submission ? "default" : "outline"} className="w-full">
                {submission ? 'Continue Form' : 'Start Form'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              View Results
            </CardTitle>
            <CardDescription>
              View detailed performance results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {submission?.status === 'submitted' || submission?.status === 'verified' || submission?.status === 'approved' ? 
                'View your detailed performance results and download reports.' : 
                'Submit the form first to view results.'
              }
            </p>
            <Link href="/admin/campaign-form/results">
              <Button 
                variant={submission?.status === 'submitted' || submission?.status === 'verified' || submission?.status === 'approved' ? "default" : "outline"} 
                className="w-full"
                disabled={!submission || (submission.status !== 'submitted' && submission.status !== 'verified' && submission.status !== 'approved')}
              >
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {submission && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates on your form submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Form created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(submission.submittedAt || '').toLocaleString()}
                  </p>
                </div>
              </div>
              {submission.submittedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Form submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
