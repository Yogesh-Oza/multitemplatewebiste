'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useAdminContext } from '@/components/providers/admin-context';
import { 
  ArrowLeft,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  PieChart,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ResultsData {
  basicInfo: {
    grampanchayatName: string;
    taluka: string;
    population: number;
    families: number;
    gpoName: string;
    sarpanchName: string;
    populationCategory: string;
  };
  summary: {
    grandTotal: number;
    maxPossibleTotal: number;
    percentage: number;
    rank?: number;
  };
  sectionResults: Array<{
    sectionId: number;
    title: string;
    titleEn: string;
    achievedMarks: number;
    maxMarks: number;
    percentage: number;
    items: Array<{
      itemId: string;
      fieldName: string;
      target: number;
      achieved: number;
      marks: number;
    }>;
  }>;
  innovations?: Array<{
    description: string;
    marks: number;
  }>;
}

export default function ResultsPage() {
  const { subdomainId } = useAdminContext();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [subdomainId]);

  const fetchResults = async () => {
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
        const defaultForm = formData.forms[0];
        
        // Get submission with results
        const submissionResponse = await fetch(`/api/campaign-form/submission?subdomainId=${subdomainId}&campaignFormId=${defaultForm.id}`);
        const submissionData = await submissionResponse.json();
        
        if (submissionResponse.ok && submissionData.submission) {
          const submission = submissionData.submission;
          
          // Calculate section results
          const sectionResults = defaultForm.sections
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((section: any) => {
            // Handle both object and number formats for section totals
            const sectionTotal = submission.summary?.sectionTotals?.[section.id];
            const sectionMarks = typeof sectionTotal === 'object' 
              ? Number(sectionTotal?.achievedMarks || 0)
              : Number(sectionTotal || 0);
            
            // Calculate max marks from items in the section
            const sectionItems = submission.itemValues?.filter((item: any) => item.section.id === section.id) || [];
            const calculatedMaxMarks = sectionItems.reduce((total: number, item: any) => {
              return total + (item.item.maxMarks || 0);
            }, 0);
            
            const maxMarks = calculatedMaxMarks > 0 ? calculatedMaxMarks : section.maxMarks;
            const percentage = maxMarks > 0 ? Math.round((sectionMarks / maxMarks) * 100) : 0;
            
            return {
              sectionId: section.sectionId,
              title: section.title,
              titleEn: section.titleEn,
              achievedMarks: sectionMarks,
              maxMarks: maxMarks,
              percentage,
              items: sectionItems
            };
          });

          const results: ResultsData = {
            basicInfo: submission.basicInfo || {},
            summary: {
              grandTotal: submission.totalMarks || 0,
              maxPossibleTotal: submission.totalMaxMarks || defaultForm.maxPossibleTotal,
              percentage: submission.totalMarks && submission.totalMaxMarks ? 
                Math.round((submission.totalMarks / submission.totalMaxMarks) * 100) : 0
            },
            sectionResults,
            innovations: submission.itemValues?.filter((item: any) => 
              item.item.itemType === 'innovation' && item.innovations
            ).flatMap((item: any) => 
              item.innovations.map((innovation: string) => ({
                description: innovation,
                marks: 1
              }))
            ) || []
          };

          setResultsData(results);
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      
      const response = await fetch('/api/campaign-form/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: 'current' // This should be the actual submission ID
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `campaign-form-results-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Excel file downloaded successfully');
      } else {
        toast.error('Failed to download Excel file');
      }
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Failed to download Excel file');
    } finally {
      setDownloading(false);
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percentage >= 50) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge className="bg-red-500">Needs Improvement</Badge>;
  };

  const getBestPerformingSections = () => {
    if (!resultsData) return [];
    return resultsData.sectionResults
      .filter(section => section.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  };

  const getAreasForImprovement = () => {
    if (!resultsData) return [];
    return resultsData.sectionResults
      .filter(section => section.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3);
  };

  const prepareRadarData = () => {
    if (!resultsData) return [];
    return resultsData.sectionResults.map(section => ({
      section: section.title,
      percentage: section.percentage
    }));
  };

  const prepareBarData = () => {
    if (!resultsData) return [];
    return resultsData.sectionResults.map(section => ({
      section: `Section ${section.sectionId}`,
      achieved: Number(section.achievedMarks || 0),
      max: section.maxMarks
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
        <p className="text-muted-foreground">
          Please submit the campaign form first to view results.
        </p>
        <Link href="/admin/campaign-form/form">
          <Button className="mt-4">
            Fill Campaign Form
          </Button>
        </Link>
      </div>
    );
  }

  const bestSections = getBestPerformingSections();
  const improvementAreas = getAreasForImprovement();
  const radarData = prepareRadarData();
  const barData = prepareBarData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaign-form">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Campaign Form Results</h1>
            <p className="text-muted-foreground">
              {resultsData.basicInfo.grampanchayatName} - Performance Analysis
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadExcel} disabled={downloading}>
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Downloading...' : 'Download Excel'}
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {resultsData.summary.grandTotal.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Marks Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {resultsData.summary.percentage}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {resultsData.summary.maxPossibleTotal.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Max Possible</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">
                {resultsData.basicInfo.populationCategory}
              </div>
              <div className="text-sm text-muted-foreground">Population Category</div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={resultsData.summary.percentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5" />
              Section-wise Performance
            </CardTitle>
            <CardDescription>
              Performance across all sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="section" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="percentage"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Marks Comparison
            </CardTitle>
            <CardDescription>
              Achieved vs Maximum marks by section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="achieved" fill="#3b82f6" name="Achieved" />
                <Bar dataKey="max" fill="#e5e7eb" name="Maximum" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Section-wise Performance
          </CardTitle>
          <CardDescription>
            Detailed breakdown of performance across all sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resultsData.sectionResults.map((section) => (
              <div key={section.sectionId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Section {section.sectionId}: {section.title}</h4>
                    <p className="text-sm text-muted-foreground">{section.titleEn}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                    </div>
                    <div className={`text-sm font-medium ${getPerformanceColor(section.percentage)}`}>
                      {section.percentage}%
                    </div>
                    {getPerformanceBadge(section.percentage)}
                  </div>
                </div>
                <Progress value={section.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Best Performing Sections
            </CardTitle>
            <CardDescription>
              Your strongest areas of performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bestSections.length > 0 ? (
              <div className="space-y-3">
                {bestSections.map((section, index) => (
                  <div key={section.sectionId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-muted-foreground">{section.titleEn}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{section.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No sections with significant performance yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Sections that need more attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {improvementAreas.length > 0 ? (
              <div className="space-y-3">
                {improvementAreas.map((section, index) => (
                  <div key={section.sectionId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-muted-foreground">{section.titleEn}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">{section.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">All sections are performing well!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Innovation Items */}
      {resultsData.innovations && resultsData.innovations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Innovation Items
            </CardTitle>
            <CardDescription>
              Innovative initiatives implemented by your village
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resultsData.innovations.map((innovation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="font-medium">{String(innovation.description || '')}</div>
                  </div>
                  <Badge className="bg-purple-500">{Number(innovation.marks || 0)} mark</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Village Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Village Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Gram Panchayat</Label>
              <p className="text-lg">{resultsData.basicInfo.grampanchayatName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Taluka</Label>
              <p className="text-lg">{resultsData.basicInfo.taluka}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Population</Label>
              <p className="text-lg">{resultsData.basicInfo.population.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Families</Label>
              <p className="text-lg">{resultsData.basicInfo.families.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">GPO Name</Label>
              <p className="text-lg">{resultsData.basicInfo.gpoName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Sarpanch Name</Label>
              <p className="text-lg">{resultsData.basicInfo.sarpanchName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
