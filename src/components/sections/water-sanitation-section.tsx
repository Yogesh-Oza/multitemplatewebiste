'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Shield, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  TrendingUp,
  BarChart3,
  Zap,
  Wrench
} from 'lucide-react';

interface WaterSanitationData {
  waterSupply: {
    totalConnections: number;
    functionalConnections: number;
    dailySupply: string;
    waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
    lastTested: string;
    treatmentPlant: boolean;
    storageCapacity: string;
  };
  sanitation: {
    totalToilets: number;
    functionalToilets: number;
    publicToilets: number;
    wasteCollection: boolean;
    wasteProcessing: boolean;
    drainageSystem: boolean;
    lastCleaning: string;
  };
  facilities: {
    id: string;
    name: string;
    nameEn: string;
    type: 'water' | 'sanitation' | 'treatment' | 'storage';
    status: 'operational' | 'maintenance' | 'non-functional';
    location: string;
    capacity: string;
    lastMaintenance: string;
    contactInfo: string;
  }[];
}

interface WaterSanitationSectionProps {
  data?: WaterSanitationData;
}

export default function WaterSanitationSection({ data }: WaterSanitationSectionProps) {
  // Demo data for when no data is available
  const demoData: WaterSanitationData = {
    waterSupply: {
      totalConnections: 450,
      functionalConnections: 420,
      dailySupply: '24 hours',
      waterQuality: 'good',
      lastTested: '2024-12-01',
      treatmentPlant: true,
      storageCapacity: '50,000 liters'
    },
    sanitation: {
      totalToilets: 380,
      functionalToilets: 365,
      publicToilets: 12,
      wasteCollection: true,
      wasteProcessing: true,
      drainageSystem: true,
      lastCleaning: '2024-12-01'
    },
    facilities: [
      {
        id: 'facility-1',
        name: 'पाणी शोधन केंद्र',
        nameEn: 'Water Treatment Plant',
        type: 'treatment',
        status: 'operational',
        location: 'गावाच्या पूर्व भागात',
        capacity: '25,000 लिटर/दिवस',
        lastMaintenance: '2024-11-15',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-2',
        name: 'पाणी टाकी',
        nameEn: 'Water Tank',
        type: 'storage',
        status: 'operational',
        location: 'ग्रामपंचायत कार्यालयजवळ',
        capacity: '50,000 लिटर',
        lastMaintenance: '2024-11-20',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-3',
        name: 'स्वच्छता केंद्र',
        nameEn: 'Sanitation Center',
        type: 'sanitation',
        status: 'operational',
        location: 'गावाच्या मध्य भागात',
        capacity: '100 कुटुंबे',
        lastMaintenance: '2024-11-25',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-4',
        name: 'कचरा प्रक्रिया केंद्र',
        nameEn: 'Waste Processing Center',
        type: 'sanitation',
        status: 'maintenance',
        location: 'गावाच्या पश्चिम भागात',
        capacity: '500 किलो/दिवस',
        lastMaintenance: '2024-12-01',
        contactInfo: '+91-XXXX-XXXXXX'
      }
    ]
  };

  const displayData = data || demoData;

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getWaterQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'उत्कृष्ट';
      case 'good':
        return 'चांगले';
      case 'fair':
        return 'सामान्य';
      case 'poor':
        return 'खराब';
      default:
        return 'अज्ञात';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          label: 'चालू',
          labelEn: 'Operational',
          color: 'text-green-600 bg-green-100',
          icon: CheckCircle
        };
      case 'maintenance':
        return {
          label: 'देखभाल',
          labelEn: 'Maintenance',
          color: 'text-yellow-600 bg-yellow-100',
          icon: Wrench
        };
      case 'non-functional':
        return {
          label: 'बंद',
          labelEn: 'Non-functional',
          color: 'text-red-600 bg-red-100',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'अज्ञात',
          labelEn: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: AlertTriangle
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'water':
        return {
          label: 'पाणी',
          labelEn: 'Water',
          color: 'bg-blue-500',
          icon: Droplets
        };
      case 'sanitation':
        return {
          label: 'स्वच्छता',
          labelEn: 'Sanitation',
          color: 'bg-green-500',
          icon: Shield
        };
      case 'treatment':
        return {
          label: 'शोधन',
          labelEn: 'Treatment',
          color: 'bg-purple-500',
          icon: Activity
        };
      case 'storage':
        return {
          label: 'साठवण',
          labelEn: 'Storage',
          color: 'bg-orange-500',
          icon: Droplets
        };
      default:
        return {
          label: 'इतर',
          labelEn: 'Other',
          color: 'bg-gray-500',
          icon: Wrench
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Droplets className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            पाणीपुरवठा आणि स्वच्छता
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Water Supply & Sanitation
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          गावातील पाणीपुरवठा, स्वच्छता सुविधा आणि कचरा व्यवस्थापन
        </p>
      </div>

      {/* Water Supply Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Droplets className="h-6 w-6 text-blue-600" />
            पाणीपुरवठा माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {displayData.waterSupply.functionalConnections}
              </div>
              <div className="text-gray-600">कार्यरत कनेक्शन</div>
              <div className="text-sm text-gray-500">
                {displayData.waterSupply.totalConnections} पैकी
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {displayData.waterSupply.dailySupply}
              </div>
              <div className="text-gray-600">दैनिक पुरवठा</div>
              <div className="text-sm text-gray-500">प्रति दिवस</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {displayData.waterSupply.storageCapacity}
              </div>
              <div className="text-gray-600">साठवण क्षमता</div>
              <div className="text-sm text-gray-500">एकूण</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Badge className={`${getWaterQualityColor(displayData.waterSupply.waterQuality)} text-lg px-4 py-2`}>
                {getWaterQualityLabel(displayData.waterSupply.waterQuality)}
              </Badge>
              <div className="text-gray-600 mt-2">पाणी गुणवत्ता</div>
              <div className="text-sm text-gray-500">
                अद्यतन: {new Date(displayData.waterSupply.lastTested).toLocaleDateString('mr-IN')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sanitation Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-6 w-6 text-green-600" />
            स्वच्छता माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {displayData.sanitation.functionalToilets}
              </div>
              <div className="text-gray-600">कार्यरत शौचालये</div>
              <div className="text-sm text-gray-500">
                {displayData.sanitation.totalToilets} पैकी
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {displayData.sanitation.publicToilets}
              </div>
              <div className="text-gray-600">सार्वजनिक शौचालये</div>
              <div className="text-sm text-gray-500">एकूण</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-2">
                {displayData.sanitation.wasteCollection ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div className="text-gray-600">कचरा संकलन</div>
              <div className="text-sm text-gray-500">
                {displayData.sanitation.wasteCollection ? 'सक्रिय' : 'निष्क्रिय'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-2">
                {displayData.sanitation.drainageSystem ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div className="text-gray-600">निकासी व्यवस्था</div>
              <div className="text-sm text-gray-500">
                {displayData.sanitation.drainageSystem ? 'उपलब्ध' : 'अनुपलब्ध'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayData.facilities.map((facility) => {
          const typeInfo = getTypeInfo(facility.type);
          const statusInfo = getStatusInfo(facility.status);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={facility.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {facility.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{facility.nameEn}</p>
                    </div>
                  </div>
                  <Badge className={`${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{facility.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>क्षमता: {facility.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>अद्यतन: {new Date(facility.lastMaintenance).toLocaleDateString('mr-IN')}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">संपर्क माहिती</div>
                    <div className="text-gray-500">{facility.contactInfo}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${facility.contactInfo}`, '_self')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    कॉल करा
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                पाणी आणि स्वच्छता समस्या
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              पाणीपुरवठा किंवा स्वच्छता संबंधित कोणतीही समस्या असल्यास ताबडतोब संपर्क करा
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Phone className="h-4 w-4 mr-2" />
                तातडीचा संपर्क
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                तक्रार नोंदवा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
