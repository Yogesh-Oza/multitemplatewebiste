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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  Download,
  Filter,
  Search
} from 'lucide-react';

interface VillageData {
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
  rank: number;
  sections: Array<{
    section: {
      title: string;
      titleEn: string;
      maxMarks: number;
    };
    marks: number;
    maxMarks: number;
  }>;
}

interface DashboardStats {
  totalVillages: number;
  submittedVillages: number;
  pendingVillages: number;
  averagePercentage: number;
  topPerformer: VillageData | null;
  bottomPerformer: VillageData | null;
}

export default function SuperAdminVillageMarkingDashboard() {
  const [villages, setVillages] = useState<VillageData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'percentage' | 'marks'>('rank');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/village-marking/reports?type=village-comparison');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setVillages(data.villages || []);
      setStats(data.summary || {
        totalVillages: 0,
        submittedVillages: 0,
        pendingVillages: 0,
        averagePercentage: 0,
        topPerformer: null,
        bottomPerformer: null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredVillages = villages.filter(village => {
    const matchesSearch = village.village.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        village.village.villageNameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !districtFilter || village.village.districtName === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const sortedVillages = [...filteredVillages].sort((a, b) => {
    switch (sortBy) {
      case 'percentage':
        return b.percentage - a.percentage;
      case 'marks':
        return b.totalMarks - a.totalMarks;
      default:
        return a.rank - b.rank;
    }
  });

  const chartData = sortedVillages.slice(0, 10).map(village => ({
    name: village.village.villageName,
    percentage: village.percentage,
    marks: village.totalMarks,
    rank: village.rank
  }));

  const sectionData = villages.length > 0 ? villages[0].sections.map(section => ({
    section: section.section.title,
    averagePercentage: (section.marks / section.maxMarks) * 100,
    maxMarks: section.maxMarks
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
          <h1 className="text-3xl font-bold text-gray-900">गाव गुणांक व्यवस्थापन</h1>
          <p className="text-gray-600">Village Marking Management Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDashboardData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVillages || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered villages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.submittedVillages || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalVillages ? ((stats.submittedVillages / stats.totalVillages) * 100).toFixed(1) : '0.0'}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.pendingVillages || 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting submission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.averagePercentage?.toFixed(1) || '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Village Performance</CardTitle>
            <CardDescription>Percentage scores of top performing villages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
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

        {/* Section Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Section-wise Performance</CardTitle>
            <CardDescription>Average performance across different sections</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sectionData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="section" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="averagePercentage"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Village Comparison Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Village Comparison</CardTitle>
              <CardDescription>Detailed comparison of all villages</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 border rounded-md"
                />
              </div>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Districts</option>
                {/* Add district options */}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="rank">Sort by Rank</option>
                <option value="percentage">Sort by Percentage</option>
                <option value="marks">Sort by Marks</option>
              </select>
            </div>
          </div>
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
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedVillages.map((village) => (
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
                        variant={
                          village.percentage >= 90 ? "default" :
                          village.percentage >= 80 ? "secondary" :
                          village.percentage >= 70 ? "outline" : "destructive"
                        }
                      >
                        {village.percentage >= 90 ? 'A+' :
                         village.percentage >= 80 ? 'A' :
                         village.percentage >= 70 ? 'B+' :
                         village.percentage >= 60 ? 'B' :
                         village.percentage >= 50 ? 'C' : 'D'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
