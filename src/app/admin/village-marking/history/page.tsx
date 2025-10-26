'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar
} from 'lucide-react';

interface SubmissionHistory {
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

export default function SubmissionHistoryPage() {
  const [submissions, setSubmissions] = useState<SubmissionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSubmissionHistory();
  }, []);

  const fetchSubmissionHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/village-marking/submission?status=all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission history');
      }
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'submitted': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'draft': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
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

  const handleViewDetails = (submission: SubmissionHistory) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  const handleExport = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/village-marking/export?submissionId=${submissionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `village-marking-${submissionId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading History</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchSubmissionHistory} className="bg-blue-600 hover:bg-blue-700">
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
          <h1 className="text-3xl font-bold text-gray-900">इतिहास</h1>
          <p className="text-gray-600">Submission History - View past submissions</p>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const percentage = submission.totalMaxMarks > 0 
              ? (submission.totalMarks / submission.totalMaxMarks) * 100 
              : 0;
            const grade = getGrade(percentage);

            return (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(submission.status)}
                      <div>
                        <h3 className="text-lg font-semibold">{submission.section.title}</h3>
                        <p className="text-sm text-gray-500">{submission.section.titleEn}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {submission.submittedAt 
                                ? new Date(submission.submittedAt).toLocaleDateString('en-IN')
                                : 'Not submitted'
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {submission.totalMarks} / {submission.totalMaxMarks} marks
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <div className="mt-2">
                          <Badge 
                            style={{ 
                              backgroundColor: getGradeColor(grade), 
                              color: 'white' 
                            }}
                          >
                            {grade}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(submission)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(submission.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Found</h3>
            <p className="text-gray-500 mb-4">You haven't made any submissions yet.</p>
            <Button onClick={() => window.location.href = '/admin/village-marking/form'}>
              Create First Submission
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Details Modal */}
      {showDetails && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Submission Details</h2>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Section</label>
                  <p className="text-lg">{selectedSubmission.section.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(selectedSubmission.status)}>
                    {selectedSubmission.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Marks</label>
                  <p className="text-lg">{selectedSubmission.totalMarks} / {selectedSubmission.totalMaxMarks}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Percentage</label>
                  <p className="text-lg">
                    {selectedSubmission.totalMaxMarks > 0 
                      ? ((selectedSubmission.totalMarks / selectedSubmission.totalMaxMarks) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted At</label>
                  <p className="text-lg">
                    {selectedSubmission.submittedAt 
                      ? new Date(selectedSubmission.submittedAt).toLocaleString('en-IN')
                      : 'Not submitted'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="text-lg">
                    {selectedSubmission.approvedAt 
                      ? new Date(selectedSubmission.approvedAt).toLocaleString('en-IN')
                      : 'Not approved'
                    }
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Field Values</h3>
                <div className="space-y-3">
                  {selectedSubmission.fieldValues.map((fieldValue, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{fieldValue.field.fieldName}</h4>
                          <p className="text-sm text-gray-500">{fieldValue.field.fieldNameEn}</p>
                        </div>
                        <div className="text-right">
                          {fieldValue.udisht !== null && (
                            <div className="text-sm">
                              <span className="text-gray-500">उदिष्ट:</span> {fieldValue.udisht}
                            </div>
                          )}
                          {fieldValue.sadhya !== null && (
                            <div className="text-sm">
                              <span className="text-gray-500">साध्य:</span> {fieldValue.sadhya}
                            </div>
                          )}
                          {fieldValue.percentage !== null && (
                            <div className="text-sm">
                              <span className="text-gray-500">टक्केवारी:</span> {fieldValue.percentage.toFixed(2)}%
                            </div>
                          )}
                          {fieldValue.marks !== null && (
                            <div className="text-sm">
                              <span className="text-gray-500">गुण:</span> {fieldValue.marks}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
