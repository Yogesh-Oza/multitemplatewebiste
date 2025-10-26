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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  Download, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3
} from 'lucide-react';

interface VillageRanking {
  rank: number;
  village: {
    subdomain: string;
    villageName: string;
    villageNameEn: string;
    districtName: string;
    subDistrictName: string;
  };
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  grade: string;
}

interface SectionAnalysis {
  section: {
    title: string;
    titleEn: string;
    maxMarks: number;
  };
  totalMarks: number;
  totalMaxMarks: number;
  villageCount: number;
  averagePercentage: number;
  performance: string;
}

interface ReportData {
  rankings: VillageRanking[];
  sections: SectionAnalysis[];
  summary: {
    totalVillages: number;
    gradeDistribution: { [key: string]: number };
    topPerformers: VillageRanking[];
    bottomPerformers: VillageRanking[];
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'village-comparison' | 'section-analysis' | 'ranking'>('ranking');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted');

  useEffect(() => {
    fetchReportData();
  }, [reportType, districtFilter, statusFilter]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: reportType,
        ...(districtFilter && { district: districtFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await fetch(`/api/super-admin/village-marking/reports?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' = 'excel') => {
    try {
      const params = new URLSearchParams({
        type: reportType,
        format,
        ...(districtFilter && { district: districtFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await fetch(`/api/super-admin/village-marking/reports/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `village-marking-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
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

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'average': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchReportData} className="bg-blue-600 hover:bg-blue-700">
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
          <h1 className="text-3xl font-bold text-gray-900">अहवाल</h1>
          <p className="text-gray-600">Reports - Detailed analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="ranking">Village Rankings</option>
                <option value="village-comparison">Village Comparison</option>
                <option value="section-analysis">Section Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">District</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Districts</option>
                {/* Add district options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReportData} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.totalVillages}</div>
                <p className="text-xs text-muted-foreground">
                  Participating villages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reportData.summary.topPerformers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  A+ grade villages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {reportData.rankings.length > 0 
                    ? (reportData.rankings.reduce((sum, v) => sum + v.percentage, 0) / reportData.rankings.length).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(reportData.summary.gradeDistribution).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Different grades
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Village Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Village Performance Distribution</CardTitle>
                <CardDescription>Percentage distribution of village scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.rankings.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="village.villageName" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100} 
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, 'Percentage']}
                      labelFormatter={(label) => `Village: ${label}`}
                    />
                    <Bar dataKey="percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of villages by grade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(reportData.summary.gradeDistribution).map(([grade, count]) => ({
                        name: grade,
                        value: count,
                        color: getGradeColor(grade)
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(reportData.summary.gradeDistribution).map(([grade, count], index) => (
                        <Cell key={`cell-${index}`} fill={getGradeColor(grade)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Section Analysis Chart */}
          {reportData.sections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Section-wise Performance</CardTitle>
                <CardDescription>Average performance across different sections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData.sections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="section.title" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120} 
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, 'Average Percentage']}
                      labelFormatter={(label) => `Section: ${label}`}
                    />
                    <Bar dataKey="averagePercentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Village Rankings</CardTitle>
              <CardDescription>Complete ranking of all villages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Rank</th>
                      <th className="text-left p-2">Village Name</th>
                      <th className="text-left p-2">District</th>
                      <th className="text-left p-2">Marks</th>
                      <th className="text-left p-2">Percentage</th>
                      <th className="text-left p-2">Grade</th>
                      <th className="text-left p-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.rankings.map((village) => (
                      <tr key={village.village.subdomain} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Badge variant={village.rank <= 3 ? "default" : "secondary"}>
                            #{village.rank}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{village.village.villageName}</div>
                            <div className="text-sm text-gray-500">{village.village.villageNameEn}</div>
                          </div>
                        </td>
                        <td className="p-2">{village.village.districtName}</td>
                        <td className="p-2">
                          {village.totalMarks} / {village.totalMaxMarks}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(village.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{village.percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge 
                            style={{ backgroundColor: getGradeColor(village.grade), color: 'white' }}
                          >
                            {village.grade}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            {village.percentage >= 80 ? (
                              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            ) : village.percentage >= 60 ? (
                              <Target className="w-4 h-4 text-blue-600 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                            )}
                            <span className="text-sm">
                              {village.percentage >= 80 ? 'Excellent' :
                               village.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
