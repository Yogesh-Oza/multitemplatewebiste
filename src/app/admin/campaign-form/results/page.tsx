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
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Heart,
  Leaf,
  Lightbulb,
  Rocket,
  Crown,
  Gem
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell } from 'recharts';

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
  const [animateCards, setAnimateCards] = useState(false);

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
            innovations: []
          };

          setResultsData(results);
          // Trigger animations after data is loaded
          setTimeout(() => setAnimateCards(true), 100);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-purple-300 border-r-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analyzing Your Performance
            </h3>
            <p className="text-muted-foreground animate-pulse">
              Preparing your detailed results...
            </p>
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className={`flex justify-between items-center transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4">
            <Link href="/admin/campaign-form">
              <Button variant="ghost" className="hover:bg-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campaign Form Results
              </h1>
              <p className="text-muted-foreground text-lg">
                {resultsData.basicInfo.grampanchayatName} - Performance Analysis
              </p>
            </div>
          </div>
          <Button 
            onClick={handleDownloadExcel} 
            disabled={downloading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download Excel'}
          </Button>
        </div>

        {/* Overall Score Card */}
        <Card className={`bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '200ms'}}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Overall Performance
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {resultsData.summary.grandTotal.toFixed(1)}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Marks Achieved</div>
              </div>
              <div className="text-center group">
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {resultsData.summary.percentage}%
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Target className="w-4 h-4 text-green-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Overall Score</div>
              </div>
              <div className="text-center group">
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {resultsData.summary.maxPossibleTotal.toFixed(1)}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-4 h-4 text-purple-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Max Possible</div>
              </div>
              <div className="text-center group">
                <div className="relative">
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 break-words">
                    {resultsData.basicInfo.populationCategory}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Users className="w-4 h-4 text-orange-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Population Category</div>
              </div>
            </div>
            <div className="mt-8">
              <div className="relative">
                <Progress 
                  value={resultsData.summary.percentage} 
                  className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-3 font-medium">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  0%
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  50%
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  100%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '400ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Radar className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Section-wise Performance
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Performance across all sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="section" tick={{fontSize: 12}} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fontSize: 10}} />
                  <Radar
                    name="Performance"
                    dataKey="percentage"
                    stroke="url(#gradient1)"
                    fill="url(#gradient1)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-white to-purple-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '600ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Marks Comparison
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Achieved vs Maximum marks by section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="section" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="achieved" fill="url(#gradient2)" name="Achieved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" fill="#e5e7eb" name="Maximum" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section-wise Performance */}
        <Card className={`bg-gradient-to-br from-white to-green-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '800ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Section-wise Performance
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Detailed breakdown of performance across all sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {resultsData.sectionResults.map((section, index) => {
                const getSectionIcon = (sectionId: number) => {
                  const icons = [Shield, Heart, Leaf, Zap, Users, Lightbulb, Rocket, Gem, Crown, Star];
                  return icons[sectionId % icons.length] || Target;
                };
                const SectionIcon = getSectionIcon(section.sectionId);
                
                return (
                  <div 
                    key={section.sectionId} 
                    className="group bg-gradient-to-r from-white to-gray-50/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <SectionIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">
                            Section {section.sectionId}: {section.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{section.titleEn}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                        </div>
                        <div className={`text-lg font-semibold ${getPerformanceColor(section.percentage)}`}>
                          {section.percentage}%
                        </div>
                        <div className="mt-2">
                          {getPerformanceBadge(section.percentage)}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={section.percentage} 
                        className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`bg-gradient-to-br from-white to-yellow-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1000ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Best Performing Sections
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Your strongest areas of performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bestSections.length > 0 ? (
                <div className="space-y-4">
                  {bestSections.map((section, index) => (
                    <div key={section.sectionId} className="group bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                              {index + 1}
                            </div>
                            <div className="absolute -top-1 -right-1">
                              <Crown className="w-4 h-4 text-yellow-500" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{section.title}</div>
                            <div className="text-sm text-muted-foreground">{section.titleEn}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {section.percentage}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-muted-foreground">No sections with significant performance yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-white to-red-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1200ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Areas for Improvement
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Sections that need more attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {improvementAreas.length > 0 ? (
                <div className="space-y-4">
                  {improvementAreas.map((section, index) => (
                    <div key={section.sectionId} className="group bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                              {index + 1}
                            </div>
                            <div className="absolute -top-1 -right-1">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{section.title}</div>
                            <div className="text-sm text-muted-foreground">{section.titleEn}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            {section.percentage}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Number(section.achievedMarks || 0).toFixed(1)} / {section.maxMarks}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-muted-foreground">All sections are performing well!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Innovation Items */}
        {resultsData.innovations && resultsData.innovations.length > 0 && (
          <Card className={`bg-gradient-to-br from-white to-purple-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1400ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Innovation Items
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Innovative initiatives implemented by your village
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultsData.innovations.map((innovation, index) => (
                  <div key={index} className="group bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                            {index + 1}
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          </div>
                        </div>
                        <div className="font-semibold text-gray-800">{String(innovation.description || '')}</div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                        {Number(innovation.marks || 0)} mark
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Village Information */}
        <Card className={`bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1600ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Village Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-blue-600">Gram Panchayat</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.grampanchayatName}</p>
              </div>
              <div className="group bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-green-600">Taluka</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.taluka}</p>
              </div>
              <div className="group bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-purple-600">Population</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.population.toLocaleString()}</p>
              </div>
              <div className="group bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-orange-600">Families</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.families.toLocaleString()}</p>
              </div>
              <div className="group bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-indigo-600">GPO Name</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.gpoName}</p>
              </div>
              <div className="group bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/50 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <Label className="text-sm font-medium text-teal-600">Sarpanch Name</Label>
                <p className="text-xl font-semibold text-gray-800 mt-1">{resultsData.basicInfo.sarpanchName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
