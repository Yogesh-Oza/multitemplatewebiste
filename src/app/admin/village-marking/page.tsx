'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  FileText,
  Edit,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Submission {
  id: string;
  status: string;
  totalMarks: number;
  totalMaxMarks: number;
  submittedAt: Date | null;
  approvedAt: Date | null;
  section: {
    title: string;
    titleEn: string;
    maxMarks: number;
  };
  fieldValues: Array<{
    field: {
      fieldName: string;
      fieldNameEn: string;
      fieldType: string;
    };
    udisht: number | null;
    sadhya: number | null;
    percentage: number | null;
    marks: number | null;
  }>;
}

interface DashboardStats {
  currentMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  completionRate: number;
  sectionsCompleted: number;
  totalSections: number;
  lastSubmission: Date | null;
  status: string;
}

export default function VillageMarkingDashboard() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/village-marking/submission');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setSubmission(data.submission);
      
      if (data.submission) {
        const percentage = data.submission.totalMaxMarks > 0 
          ? (data.submission.totalMarks / data.submission.totalMaxMarks) * 100 
          : 0;
        
        const grade = percentage >= 90 ? 'A+' :
                     percentage >= 80 ? 'A' :
                     percentage >= 70 ? 'B+' :
                     percentage >= 60 ? 'B' :
                     percentage >= 50 ? 'C' : 'D';
        
        setStats({
          currentMarks: data.submission.totalMarks,
          maxMarks: data.submission.totalMaxMarks,
          percentage,
          grade,
          completionRate: percentage,
          sectionsCompleted: 1, // Assuming one section per submission
          totalSections: 1,
          lastSubmission: data.submission.submittedAt,
          status: data.submission.status
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-orange-600 bg-orange-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return '#10B981';
      case 'A': return '#3B82F6';
      case 'B+': return '#8B5CF6';
      case 'B': return '#F59E0B';
      case 'C': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">गाव गुणांक</h1>
          <p className="text-gray-600">Village Marking Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/admin/village-marking/form'}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Form
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin/village-marking/export'}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {submission && (
        <div className={`p-4 rounded-lg border ${getStatusColor(submission.status)}`}>
          <div className="flex items-center">
            {getStatusIcon(submission.status)}
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                Status: {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </h3>
              <p className="text-sm">
                {submission.status === 'draft' && 'Your form is saved as draft. You can continue editing.'}
                {submission.status === 'submitted' && 'Your form has been submitted for review.'}
                {submission.status === 'approved' && 'Your form has been approved.'}
                {submission.status === 'rejected' && 'Your form has been rejected. Please review and resubmit.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMarks}</div>
              <p className="text-xs text-muted-foreground">
                out of {stats.maxMarks} marks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Percentage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.percentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: getGradeColor(stats.grade) }}>
                {stats.grade}
              </div>
              <p className="text-xs text-muted-foreground">
                Current grade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Form completion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Chart */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Your current performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={[
                  { name: 'Performance', value: stats.percentage, fill: getGradeColor(stats.grade) }
                ]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                    {stats.percentage.toFixed(1)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section Breakdown</CardTitle>
              <CardDescription>Performance by section</CardDescription>
            </CardHeader>
            <CardContent>
              {submission && submission.fieldValues.length > 0 ? (
                <div className="space-y-4">
                  {submission.fieldValues.map((fieldValue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{fieldValue.field.fieldName}</h4>
                        <p className="text-sm text-gray-500">{fieldValue.field.fieldNameEn}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {fieldValue.marks || 0} / {fieldValue.field.fieldType === 'marks' ? '10' : 'N/A'}
                        </div>
                        {fieldValue.percentage && (
                          <div className="text-sm text-gray-500">
                            {fieldValue.percentage.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No data available. Start filling the form to see your progress.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/admin/village-marking/form'}
            >
              <Edit className="w-6 h-6 mb-2" />
              <span>Edit Form</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/admin/village-marking/history'}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span>View History</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/admin/village-marking/export'}
            >
              <Download className="w-6 h-6 mb-2" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {submission && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest submission activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    submission.status === 'approved' ? 'bg-green-500' :
                    submission.status === 'submitted' ? 'bg-blue-500' :
                    submission.status === 'draft' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">
                      {submission.status === 'draft' ? 'Form saved as draft' :
                       submission.status === 'submitted' ? 'Form submitted for review' :
                       submission.status === 'approved' ? 'Form approved' :
                       'Form rejected'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {submission.submittedAt 
                        ? new Date(submission.submittedAt).toLocaleString('en-IN')
                        : 'Not submitted yet'
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                  {submission.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
