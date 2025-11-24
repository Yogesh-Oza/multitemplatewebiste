'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  BarChart3,
  Eye,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import {
  wardCoverageDemoData,
  WardCoverageDataData
} from '@/lib/demo-schemes-beneficiary';

interface WardData {
  wardNumber: string;
  wardName: string;
  wardNameEn: string;
  totalHouseholds: number;
  beneficiaries: number;
  coveragePercentage: number;
  schemes: {
    name: string;
    nameEn: string;
    beneficiaries: number;
    color: string;
  }[];
  lastUpdated: string;
}

interface EnhancedCoverageMapSectionProps {
  wardData?: WardData[];
}

export default function EnhancedCoverageMapSection({ wardData: propWardData }: EnhancedCoverageMapSectionProps) {
  const [apiWards, setApiWards] = useState<WardCoverageDataData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'chart'>('map');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ward-coverage');
        if (response.ok) {
          const data = await response.json();
          setApiWards(data.wards || []);
          setIsDemo(Boolean(data.isDemo));
        } else {
          setError('माहिती लोड करण्यात अडचण आली');
        }
      } catch (err) {
        console.error(err);
        setError('माहिती लोड करण्यात अडचण आली');
      } finally {
        setLoading(false);
      }
    };

    if (!propWardData || propWardData.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [propWardData]);

  // Transform API ward data to component format
  const transformWards = (apiWards: WardCoverageDataData[]): WardData[] => {
    return apiWards
      .filter((w) => w.isActive)
      .map((w) => ({
        wardNumber: w.wardNumber,
        wardName: w.wardName,
        wardNameEn: w.wardNameEn,
        totalHouseholds: w.totalHouseholds,
        beneficiaries: w.beneficiaries,
        coveragePercentage: w.coveragePercentage,
        schemes: Array.isArray(w.schemes) ? w.schemes : [],
        lastUpdated: w.lastUpdated
      }));
  };

  // Demo data for when no ward data is available
  const demoWardData: WardData[] = [
    {
      wardNumber: '1',
      wardName: 'वॉर्ड क्र. १',
      wardNameEn: 'Ward No. 1',
      totalHouseholds: 150,
      beneficiaries: 120,
      coveragePercentage: 80,
      schemes: [
        { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 45, color: 'bg-blue-500' },
        { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 30, color: 'bg-green-500' },
        { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 25, color: 'bg-purple-500' },
        { name: 'इतर', nameEn: 'Others', beneficiaries: 20, color: 'bg-orange-500' }
      ],
      lastUpdated: '2024-01-15'
    },
    {
      wardNumber: '2',
      wardName: 'वॉर्ड क्र. २',
      wardNameEn: 'Ward No. 2',
      totalHouseholds: 180,
      beneficiaries: 135,
      coveragePercentage: 75,
      schemes: [
        { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 50, color: 'bg-blue-500' },
        { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 35, color: 'bg-green-500' },
        { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 30, color: 'bg-purple-500' },
        { name: 'इतर', nameEn: 'Others', beneficiaries: 20, color: 'bg-orange-500' }
      ],
      lastUpdated: '2024-01-15'
    },
    {
      wardNumber: '3',
      wardName: 'वॉर्ड क्र. ३',
      wardNameEn: 'Ward No. 3',
      totalHouseholds: 200,
      beneficiaries: 160,
      coveragePercentage: 80,
      schemes: [
        { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 60, color: 'bg-blue-500' },
        { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 40, color: 'bg-green-500' },
        { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 35, color: 'bg-purple-500' },
        { name: 'इतर', nameEn: 'Others', beneficiaries: 25, color: 'bg-orange-500' }
      ],
      lastUpdated: '2024-01-15'
    },
    {
      wardNumber: '4',
      wardName: 'वॉर्ड क्र. ४',
      wardNameEn: 'Ward No. 4',
      totalHouseholds: 120,
      beneficiaries: 90,
      coveragePercentage: 75,
      schemes: [
        { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 35, color: 'bg-blue-500' },
        { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 25, color: 'bg-green-500' },
        { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 20, color: 'bg-purple-500' },
        { name: 'इतर', nameEn: 'Others', beneficiaries: 10, color: 'bg-orange-500' }
      ],
      lastUpdated: '2024-01-15'
    }
  ];

  // Determine which ward data to use
  let displayWardData: WardData[];
  let showDemoBadge = false;

  if (propWardData && propWardData.length > 0) {
    displayWardData = propWardData;
  } else if (apiWards.length > 0) {
    displayWardData = transformWards(apiWards);
    showDemoBadge = isDemo;
  } else {
    displayWardData = demoWardData;
    showDemoBadge = true;
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  const totalHouseholds = displayWardData.reduce((sum, ward) => sum + ward.totalHouseholds, 0);
  const totalBeneficiaries = displayWardData.reduce((sum, ward) => sum + ward.beneficiaries, 0);
  const overallCoverage = totalHouseholds > 0 ? Math.round((totalBeneficiaries / totalHouseholds) * 100) : 0;

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCoverageStatus = (percentage: number) => {
    if (percentage >= 80) return { text: 'उत्कृष्ट', icon: CheckCircle, color: 'text-green-600' };
    if (percentage >= 60) return { text: 'चांगले', icon: AlertCircle, color: 'text-yellow-600' };
    return { text: 'सुधारणा आवश्यक', icon: AlertCircle, color: 'text-red-600' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-100">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            योजना कव्हरेज नकाशा
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Ward-wise Coverage Map
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          प्रत्येक वॉर्डनिहाय लाभ घेतलेल्या घरांचा इंटरअॅक्टिव्ह नकाशा आणि सांख्यिकीय विश्लेषण
        </p>
        {showDemoBadge && (
          <p className="text-xs text-blue-600 bg-white/80 px-3 py-1 inline-flex rounded-full border border-blue-100 mt-4">
            डेमो डेटा - प्रशासनामधून अपडेट करा
          </p>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalHouseholds}
            </div>
            <div className="text-gray-600">एकूण घरं</div>
            <div className="text-sm text-gray-500">Total Households</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalBeneficiaries}
            </div>
            <div className="text-gray-600">लाभार्थी</div>
            <div className="text-sm text-gray-500">Beneficiaries</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {overallCoverage}%
            </div>
            <div className="text-gray-600">कव्हरेज</div>
            <div className="text-sm text-gray-500">Coverage</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {displayWardData.length}
            </div>
            <div className="text-gray-600">वॉर्ड</div>
            <div className="text-sm text-gray-500">Wards</div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            onClick={() => setViewMode('map')}
            className="rounded-md"
          >
            <MapPin className="h-4 w-4 mr-2" />
            नकाशा
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'default' : 'ghost'}
            onClick={() => setViewMode('chart')}
            className="rounded-md"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            चार्ट
          </Button>
        </div>
      </div>

      {/* Map/Chart View */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              {viewMode === 'map' ? 'वॉर्डनिहाय नकाशा' : 'कव्हरेज चार्ट'}
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                रिफ्रेश
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                डाउनलोड
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'map' ? (
            <div className="space-y-6">
              {/* Interactive Map Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayWardData.map((ward) => {
                  const status = getCoverageStatus(ward.coveragePercentage);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div
                      key={ward.wardNumber}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedWard === ward.wardNumber
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedWard(selectedWard === ward.wardNumber ? null : ward.wardNumber)}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">
                            {ward.wardNumber}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {ward.wardName}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {ward.wardNameEn}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCoverageColor(ward.coveragePercentage)}`}>
                          <StatusIcon className="h-3 w-3" />
                          {ward.coveragePercentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Ward Details */}
              {selectedWard && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  {(() => {
                    const ward = displayWardData.find(w => w.wardNumber === selectedWard);
                    if (!ward) return null;
                    
                    const status = getCoverageStatus(ward.coveragePercentage);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900">
                            {ward.wardName} - तपशील
                          </h3>
                          <Badge className={`${getCoverageColor(ward.coveragePercentage)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.text}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">सांख्यिकी</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>एकूण घरं:</span>
                                <span className="font-medium">{ward.totalHouseholds}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>लाभार्थी:</span>
                                <span className="font-medium">{ward.beneficiaries}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>कव्हरेज:</span>
                                <span className="font-medium">{ward.coveragePercentage}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">योजना विभागणी</h4>
                            <div className="space-y-1">
                              {ward.schemes.map((scheme, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${scheme.color}`}></div>
                                    <span>{scheme.name}</span>
                                  </div>
                                  <span className="font-medium">{scheme.beneficiaries}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">प्रगती बार</h4>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className={`h-4 rounded-full transition-all duration-500 ${
                                  ward.coveragePercentage >= 80 ? 'bg-green-500' :
                                  ward.coveragePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${ward.coveragePercentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              अद्यतन: {new Date(ward.lastUpdated).toLocaleDateString('mr-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Coverage Chart */}
              <div className="space-y-4">
                {displayWardData.map((ward) => {
                  const status = getCoverageStatus(ward.coveragePercentage);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={ward.wardNumber} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {ward.wardNumber}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{ward.wardName}</h4>
                            <p className="text-sm text-gray-500">{ward.wardNameEn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {ward.beneficiaries}/{ward.totalHouseholds}
                          </span>
                          <Badge className={`${getCoverageColor(ward.coveragePercentage)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ward.coveragePercentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            ward.coveragePercentage >= 80 ? 'bg-green-500' :
                            ward.coveragePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${ward.coveragePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">कव्हरेज स्थिती</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-900">उत्कृष्ट (८०%+)</div>
                <div className="text-sm text-gray-500">Excellent Coverage</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-900">चांगले (६०-७९%)</div>
                <div className="text-sm text-gray-500">Good Coverage</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div>
                <div className="font-medium text-gray-900">सुधारणा आवश्यक (६०% खाली)</div>
                <div className="text-sm text-gray-500">Needs Improvement</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
