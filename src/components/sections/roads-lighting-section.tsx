'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Navigation as RoadIcon, 
  Lightbulb, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  BarChart3,
  Zap,
  Car,
  Users
} from 'lucide-react';

interface RoadsLightingData {
  roads: {
    totalLength: number; // in km
    pavedRoads: number;
    unpavedRoads: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    lastMaintenance: string;
    upcomingWork: string[];
  };
  streetLighting: {
    totalLights: number;
    functionalLights: number;
    ledLights: number;
    traditionalLights: number;
    workingHours: string;
    lastMaintenance: string;
    energySource: 'grid' | 'solar' | 'hybrid';
  };
  facilities: {
    id: string;
    name: string;
    nameEn: string;
    type: 'road' | 'bridge' | 'streetlight' | 'traffic';
    status: 'operational' | 'maintenance' | 'non-functional';
    location: string;
    length?: string;
    capacity?: string;
    lastMaintenance: string;
    contactInfo: string;
  }[];
}

interface RoadsLightingSectionProps {
  data?: RoadsLightingData;
}

export default function RoadsLightingSection({ data }: RoadsLightingSectionProps) {
  // Demo data for when no data is available
  const demoData: RoadsLightingData = {
    roads: {
      totalLength: 25.5,
      pavedRoads: 20.2,
      unpavedRoads: 5.3,
      condition: 'good',
      lastMaintenance: '2024-11-15',
      upcomingWork: [
        'मुख्य रस्त्याची दुरुस्ती',
        'नवीन स्ट्रीट लाइट्स स्थापना',
        'पुलाची मरम्मत'
      ]
    },
    streetLighting: {
      totalLights: 180,
      functionalLights: 165,
      ledLights: 120,
      traditionalLights: 60,
      workingHours: '6:00 PM - 6:00 AM',
      lastMaintenance: '2024-11-20',
      energySource: 'hybrid'
    },
    facilities: [
      {
        id: 'facility-1',
        name: 'मुख्य रस्ता',
        nameEn: 'Main Road',
        type: 'road',
        status: 'operational',
        location: 'गावाच्या मध्यभागातून जाणारा',
        length: '3.2 किमी',
        lastMaintenance: '2024-11-15',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-2',
        name: 'पुल',
        nameEn: 'Bridge',
        type: 'bridge',
        status: 'maintenance',
        location: 'नदीवरचा पुल',
        capacity: '10 टन',
        lastMaintenance: '2024-12-01',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-3',
        name: 'स्ट्रीट लाइट्स',
        nameEn: 'Street Lights',
        type: 'streetlight',
        status: 'operational',
        location: 'मुख्य रस्त्यावर',
        capacity: '50 लाइट्स',
        lastMaintenance: '2024-11-20',
        contactInfo: '+91-XXXX-XXXXXX'
      },
      {
        id: 'facility-4',
        name: 'ट्रॅफिक सिग्नल',
        nameEn: 'Traffic Signal',
        type: 'traffic',
        status: 'operational',
        location: 'चौकात',
        lastMaintenance: '2024-11-25',
        contactInfo: '+91-XXXX-XXXXXX'
      }
    ]
  };

  const displayData = data || demoData;

  const getConditionColor = (condition: string) => {
    switch (condition) {
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

  const getConditionLabel = (condition: string) => {
    switch (condition) {
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
      case 'road':
        return {
          label: 'रस्ता',
          labelEn: 'Road',
          color: 'bg-gray-500',
          icon: RoadIcon
        };
      case 'bridge':
        return {
          label: 'पुल',
          labelEn: 'Bridge',
          color: 'bg-blue-500',
          icon: RoadIcon
        };
      case 'streetlight':
        return {
          label: 'स्ट्रीट लाइट',
          labelEn: 'Street Light',
          color: 'bg-yellow-500',
          icon: Lightbulb
        };
      case 'traffic':
        return {
          label: 'ट्रॅफिक',
          labelEn: 'Traffic',
          color: 'bg-red-500',
          icon: Car
        };
      default:
        return {
          label: 'इतर',
          labelEn: 'Other',
          color: 'bg-gray-500',
          icon: RoadIcon
        };
    }
  };

  const getEnergySourceInfo = (source: string) => {
    switch (source) {
      case 'grid':
        return {
          label: 'ग्रिड',
          labelEn: 'Grid',
          color: 'text-blue-600 bg-blue-100',
          icon: Zap
        };
      case 'solar':
        return {
          label: 'सौर',
          labelEn: 'Solar',
          color: 'text-yellow-600 bg-yellow-100',
          icon: Zap
        };
      case 'hybrid':
        return {
          label: 'हायब्रीड',
          labelEn: 'Hybrid',
          color: 'text-green-600 bg-green-100',
          icon: Zap
        };
      default:
        return {
          label: 'अज्ञात',
          labelEn: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: Zap
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gray-100">
            <RoadIcon className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            रस्ते आणि रस्त्यावरील दिवे
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Roads & Street Lighting
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          गावातील रस्ते, पुल, स्ट्रीट लाइट्स आणि वाहतूक व्यवस्था
        </p>
      </div>

      {/* Roads Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <RoadIcon className="h-6 w-6 text-gray-600" />
            रस्ते माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {displayData.roads.totalLength} किमी
              </div>
              <div className="text-gray-600">एकूण रस्ते</div>
              <div className="text-sm text-gray-500">लांबी</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {displayData.roads.pavedRoads} किमी
              </div>
              <div className="text-gray-600">पक्के रस्ते</div>
              <div className="text-sm text-gray-500">
                {Math.round((displayData.roads.pavedRoads / displayData.roads.totalLength) * 100)}% कव्हरेज
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {displayData.roads.unpavedRoads} किमी
              </div>
              <div className="text-gray-600">कच्चे रस्ते</div>
              <div className="text-sm text-gray-500">
                {Math.round((displayData.roads.unpavedRoads / displayData.roads.totalLength) * 100)}% कव्हरेज
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Badge className={`${getConditionColor(displayData.roads.condition)} text-lg px-4 py-2`}>
                {getConditionLabel(displayData.roads.condition)}
              </Badge>
              <div className="text-gray-600 mt-2">रस्त्यांची स्थिती</div>
              <div className="text-sm text-gray-500">
                अद्यतन: {new Date(displayData.roads.lastMaintenance).toLocaleDateString('mr-IN')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Street Lighting Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            स्ट्रीट लाइटिंग माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {displayData.streetLighting.functionalLights}
              </div>
              <div className="text-gray-600">कार्यरत दिवे</div>
              <div className="text-sm text-gray-500">
                {displayData.streetLighting.totalLights} पैकी
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {displayData.streetLighting.ledLights}
              </div>
              <div className="text-gray-600">LED दिवे</div>
              <div className="text-sm text-gray-500">ऊर्जा कार्यक्षम</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {displayData.streetLighting.traditionalLights}
              </div>
              <div className="text-gray-600">पारंपरिक दिवे</div>
              <div className="text-sm text-gray-500">जुने प्रकार</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Badge className={`${getEnergySourceInfo(displayData.streetLighting.energySource).color} text-lg px-4 py-2`}>
                {getEnergySourceInfo(displayData.streetLighting.energySource).label}
              </Badge>
              <div className="text-gray-600 mt-2">ऊर्जा स्रोत</div>
              <div className="text-sm text-gray-500">
                {displayData.streetLighting.workingHours}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Work */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="h-6 w-6 text-purple-600" />
            आगामी कामे
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayData.roads.upcomingWork.map((work, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold text-gray-900">{work}</span>
                </div>
                <div className="text-sm text-gray-500">आगामी प्रकल्प</div>
              </div>
            ))}
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
                  {facility.length && (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>लांबी: {facility.length}</span>
                    </div>
                  )}
                  {facility.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>क्षमता: {facility.capacity}</span>
                    </div>
                  )}
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
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-gray-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RoadIcon className="h-8 w-8 text-gray-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              रस्ते आणि दिवे समस्या
            </h3>
          </div>
            <p className="text-gray-600 mb-6">
              रस्ते, पुल किंवा स्ट्रीट लाइट्स संबंधित कोणतीही समस्या असल्यास ताबडतोब संपर्क करा
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                <Phone className="h-4 w-4 mr-2" />
                तातडीचा संपर्क
              </Button>
              <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
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
