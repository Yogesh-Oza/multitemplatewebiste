'use client';

import { useState, useEffect } from 'react';
import { Search, Map, RefreshCw, Settings, BarChart3, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchStats {
  totalSearches: number;
  popularQueries: Array<{ query: string; count: number }>;
  searchResults: Array<{ type: string; count: number }>;
  recentSearches: Array<{ query: string; timestamp: string; results: number }>;
}

interface MapStats {
  totalPages: number;
  contentCounts: {
    announcements: number;
    projects: number;
    governmentResolutions: number;
    culturalHeritage: number;
    programs: number;
    facilities: number;
    departments: number;
    governmentSchemes: number;
    gallery: number;
  };
  lastUpdated: string;
}

export default function SearchMapAdminPage() {
  const [searchStats, setSearchStats] = useState<SearchStats | null>(null);
  const [sitemapStats, setMapStats] = useState<MapStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch search statistics (mock data for now)
      const mockSearchStats: SearchStats = {
        totalSearches: 1247,
        popularQueries: [
          { query: 'स्वच्छता', count: 45 },
          { query: 'पाणीपुरवठा', count: 38 },
          { query: 'योजना', count: 32 },
          { query: 'प्रकल्प', count: 28 },
          { query: 'तक्रार', count: 25 }
        ],
        searchResults: [
          { type: 'announcements', count: 156 },
          { type: 'projects', count: 89 },
          { type: 'government-resolutions', count: 67 },
          { type: 'cultural-heritage', count: 45 },
          { type: 'programs', count: 34 }
        ],
        recentSearches: [
          { query: 'ग्रामसभा', timestamp: '2024-01-15T10:30:00Z', results: 12 },
          { query: 'बजेट', timestamp: '2024-01-15T09:45:00Z', results: 8 },
          { query: 'सुविधा', timestamp: '2024-01-15T09:15:00Z', results: 15 }
        ]
      };

      // Fetch sitemap statistics
      const sitemapResponse = await fetch('/api/sitemap');
      const sitemapData = await sitemapResponse.json();
      
      const mockMapStats: MapStats = {
        totalPages: 16,
        contentCounts: {
          announcements: 45,
          projects: 23,
          governmentResolutions: 18,
          culturalHeritage: 12,
          programs: 15,
          facilities: 28,
          departments: 8,
          governmentSchemes: 22,
          gallery: 67
        },
        lastUpdated: new Date().toISOString()
      };

      setSearchStats(mockSearchStats);
      setMapStats(mockMapStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setIsRefreshing(false);
  };

  const rebuildSearchIndex = async () => {
    try {
      // This would trigger a search index rebuild
      console.log('Rebuilding search index...');
      // In a real implementation, this would call an API endpoint
    } catch (error) {
      console.error('Error rebuilding search index:', error);
    }
  };

  const generateMap = async () => {
    try {
      // This would trigger sitemap generation
      console.log('Generating sitemap...');
      // In a real implementation, this would call an API endpoint
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search & Map Management</h1>
          <p className="text-gray-600">Monitor search performance and manage sitemap</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Statistics */}
      {searchStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Searches</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {searchStats.totalSearches.toLocaleString()}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Popular Queries</h4>
                  <div className="space-y-2">
                    {searchStats.popularQueries.map((query, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{query.query}</span>
                        <Badge variant="secondary">{query.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Search Results by Type</h4>
                  <div className="space-y-2">
                    {searchStats.searchResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {result.type.replace('-', ' ')}
                        </span>
                        <Badge variant="outline">{result.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Recent Search Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchStats.recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{search.query}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(search.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{search.results} results</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Statistics */}
      {sitemapStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-purple-600" />
                Map Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Pages</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {sitemapStats.totalPages}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">
                    {new Date(sitemapStats.lastUpdated).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Content Distribution</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sitemapStats.contentCounts).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-700 capitalize">
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Management Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Search Index</p>
                      <p className="text-xs text-gray-600">Rebuild search index for better performance</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rebuildSearchIndex}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Rebuild
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Map</p>
                      <p className="text-xs text-gray-600">Generate fresh sitemap XML</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateMap}
                    className="text-green-600 hover:text-green-700"
                  >
                    Generate
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-600">View detailed search analytics</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
              onClick={() => window.open('/sitemap', '_blank')}
            >
              <Map className="h-6 w-6" />
              <span>View Map</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
              onClick={() => window.open('/search', '_blank')}
            >
              <Search className="h-6 w-6" />
              <span>Test Search</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-6 w-6" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
