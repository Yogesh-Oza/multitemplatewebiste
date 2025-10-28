'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Heart, 
  Users, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  BarChart3,
  BookOpen,
  Stethoscope,
  Baby,
  School
} from 'lucide-react';

interface EducationHealthData {
  education: {
    totalSchools: number;
    primarySchools: number;
    secondarySchools: number;
    anganwadis: number;
    totalStudents: number;
    totalTeachers: number;
    literacyRate: number;
    lastCensus: string;
  };
  health: {
    totalCenters: number;
    primaryHealthCenters: number;
    subCenters: number;
    anganwadiCenters: number;
    totalDoctors: number;
    totalNurses: number;
    totalBeds: number;
    lastInspection: string;
  };
  facilities: {
    id: string;
    name: string;
    nameEn: string;
    type: 'school' | 'anganwadi' | 'health_center' | 'hospital';
    status: 'operational' | 'maintenance' | 'non-functional';
    location: string;
    capacity: string;
    staff: number;
    lastInspection: string;
    contactInfo: string;
    services: string[];
  }[];
}

interface EducationHealthSectionProps {
  data?: EducationHealthData;
}

export default function EducationHealthSection({ data }: EducationHealthSectionProps) {
  // Demo data for when no data is available
  const demoData: EducationHealthData = {
    education: {
      totalSchools: 8,
      primarySchools: 5,
      secondarySchools: 3,
      anganwadis: 12,
      totalStudents: 1250,
      totalTeachers: 45,
      literacyRate: 78.5,
      lastCensus: '2021-01-01'
    },
    health: {
      totalCenters: 6,
      primaryHealthCenters: 1,
      subCenters: 3,
      anganwadiCenters: 12,
      totalDoctors: 3,
      totalNurses: 8,
      totalBeds: 15,
      lastInspection: '2024-11-20'
    },
    facilities: [
      {
        id: 'facility-1',
        name: 'प्राथमिक शाळा',
        nameEn: 'Primary School',
        type: 'school',
        status: 'operational',
        location: 'गावाच्या मध्य भागात',
        capacity: '200 विद्यार्थी',
        staff: 8,
        lastInspection: '2024-11-15',
        contactInfo: '+91-XXXX-XXXXXX',
        services: ['प्राथमिक शिक्षण', 'मध्यान्ह भोजन', 'पुस्तकालय']
      },
      {
        id: 'facility-2',
        name: 'माध्यमिक शाळा',
        nameEn: 'Secondary School',
        type: 'school',
        status: 'operational',
        location: 'गावाच्या पूर्व भागात',
        capacity: '300 विद्यार्थी',
        staff: 12,
        lastInspection: '2024-11-10',
        contactInfo: '+91-XXXX-XXXXXX',
        services: ['माध्यमिक शिक्षण', 'विज्ञान प्रयोगशाळा', 'संगणक केंद्र']
      },
      {
        id: 'facility-3',
        name: 'प्राथमिक आरोग्य केंद्र',
        nameEn: 'Primary Health Center',
        type: 'health_center',
        status: 'operational',
        location: 'ग्रामपंचायत कार्यालयजवळ',
        capacity: '50 रुग्ण',
        staff: 5,
        lastInspection: '2024-11-20',
        contactInfo: '+91-XXXX-XXXXXX',
        services: ['सामान्य उपचार', 'लसीकरण', 'प्रसूती सेवा']
      },
      {
        id: 'facility-4',
        name: 'अंगणवाडी केंद्र',
        nameEn: 'Anganwadi Center',
        type: 'anganwadi',
        status: 'operational',
        location: 'वॉर्ड क्र. २ मध्ये',
        capacity: '25 मुले',
        staff: 2,
        lastInspection: '2024-11-25',
        contactInfo: '+91-XXXX-XXXXXX',
        services: ['पूर्व प्राथमिक शिक्षण', 'पोषण', 'आरोग्य तपासणी']
      }
    ]
  };

  const displayData = data || demoData;

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
      case 'school':
        return {
          label: 'शाळा',
          labelEn: 'School',
          color: 'bg-blue-500',
          icon: School
        };
      case 'anganwadi':
        return {
          label: 'अंगणवाडी',
          labelEn: 'Anganwadi',
          color: 'bg-pink-500',
          icon: Baby
        };
      case 'health_center':
        return {
          label: 'आरोग्य केंद्र',
          labelEn: 'Health Center',
          color: 'bg-red-500',
          icon: Heart
        };
      case 'hospital':
        return {
          label: 'रुग्णालय',
          labelEn: 'Hospital',
          color: 'bg-green-500',
          icon: Stethoscope
        };
      default:
        return {
          label: 'इतर',
          labelEn: 'Other',
          color: 'bg-gray-500',
          icon: Users
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-100">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            शाळा, अंगणवाडी, आरोग्य केंद्रे
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Schools, Anganwadis, Health Centers
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          गावातील शैक्षणिक आणि आरोग्य सुविधा
        </p>
      </div>

      {/* Education Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            शिक्षण माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {displayData.education.totalSchools}
              </div>
              <div className="text-gray-600">एकूण शाळा</div>
              <div className="text-sm text-gray-500">
                प्राथमिक: {displayData.education.primarySchools}, माध्यमिक: {displayData.education.secondarySchools}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {displayData.education.anganwadis}
              </div>
              <div className="text-gray-600">अंगणवाडी</div>
              <div className="text-sm text-gray-500">पूर्व प्राथमिक शिक्षण</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {displayData.education.totalStudents}
              </div>
              <div className="text-gray-600">एकूण विद्यार्थी</div>
              <div className="text-sm text-gray-500">
                शिक्षक: {displayData.education.totalTeachers}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {displayData.education.literacyRate}%
              </div>
              <div className="text-gray-600">साक्षरता दर</div>
              <div className="text-sm text-gray-500">
                अद्यतन: {new Date(displayData.education.lastCensus).toLocaleDateString('mr-IN')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-600" />
            आरोग्य माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {displayData.health.totalCenters}
              </div>
              <div className="text-gray-600">एकूण केंद्रे</div>
              <div className="text-sm text-gray-500">
                PHC: {displayData.health.primaryHealthCenters}, Sub: {displayData.health.subCenters}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {displayData.health.totalDoctors}
              </div>
              <div className="text-gray-600">डॉक्टर</div>
              <div className="text-sm text-gray-500">
                नर्स: {displayData.health.totalNurses}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {displayData.health.totalBeds}
              </div>
              <div className="text-gray-600">एकूण बेड</div>
              <div className="text-sm text-gray-500">रुग्ण क्षमता</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {displayData.health.anganwadiCenters}
              </div>
              <div className="text-gray-600">अंगणवाडी</div>
              <div className="text-sm text-gray-500">आरोग्य केंद्रे</div>
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
                    <Users className="h-4 w-4" />
                    <span>क्षमता: {facility.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>कर्मचारी: {facility.staff}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>अद्यतन: {new Date(facility.lastInspection).toLocaleDateString('mr-IN')}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Services */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">सेवा</h4>
                  <div className="flex flex-wrap gap-1">
                    {facility.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-between pt-4 border-t">
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
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                शिक्षण आणि आरोग्य सेवा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              शिक्षण किंवा आरोग्य संबंधित कोणतीही माहिती किंवा सेवा हवी असल्यास संपर्क करा
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <GraduationCap className="h-4 w-4 mr-2" />
                शिक्षण माहिती
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Heart className="h-4 w-4 mr-2" />
                आरोग्य सेवा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
