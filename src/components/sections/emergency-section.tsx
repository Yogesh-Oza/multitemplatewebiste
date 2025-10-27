'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  Truck, 
  Flame, 
  Shield as Police, 
  Heart, 
  Zap, 
  Wind, 
  Droplets, 
  Building, 
  Car, 
  ExternalLink, 
  Download, 
  Phone as Call, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Info 
} from 'lucide-react';
import Image from 'next/image';

interface EmergencyContact {
  id: string;
  name: string;
  nameEn: string;
  type: 'police' | 'medical' | 'fire' | 'disaster' | 'administration' | 'utility';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  addressEn: string;
  description: string;
  descriptionEn: string;
  isActive: boolean;
  isEmergency: boolean;
  responseTime?: string;
  responseTimeEn?: string;
}

interface SafetyAlert {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'weather' | 'disaster' | 'health' | 'security' | 'utility' | 'traffic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  area: string;
  areaEn: string;
  instructions: string;
  instructionsEn: string;
  isActive: boolean;
  isUrgent: boolean;
}

interface SafetyResource {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'shelter' | 'hospital' | 'police-station' | 'fire-station' | 'evacuation-center' | 'aid-center';
  location: string;
  locationEn: string;
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  facilitiesEn: string[];
  contact: string;
  isActive: boolean;
  isAvailable: boolean;
}

interface EmergencySectionProps {
  contacts?: EmergencyContact[];
  alerts?: SafetyAlert[];
  resources?: SafetyResource[];
  statistics?: {
    totalContacts: number;
    activeAlerts: number;
    availableResources: number;
    responseTime: number;
    safetyScore: number;
    emergencyCalls: number;
  };
}

export function EmergencySection({ 
  contacts = [], 
  alerts = [],
  resources = [],
  statistics = {
    totalContacts: 0,
    activeAlerts: 0,
    availableResources: 0,
    responseTime: 0,
    safetyScore: 0,
    emergencyCalls: 0
  }
}: EmergencySectionProps) {
  const { t, language } = useTranslation();

  // Group contacts by type
  const groupedContacts = contacts.reduce((acc, contact) => {
    if (!acc[contact.type]) {
      acc[contact.type] = [];
    }
    acc[contact.type].push(contact);
    return acc;
  }, {} as Record<string, EmergencyContact[]>);

  // Group alerts by type
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.type]) {
      acc[alert.type] = [];
    }
    acc[alert.type].push(alert);
    return acc;
  }, {} as Record<string, SafetyAlert[]>);

  // Group resources by type
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, SafetyResource[]>);

  const getContactTypeInfo = (type: string) => {
    switch (type) {
      case 'police':
        return {
          label: language === 'en' ? 'Police' : 'पोलीस',
          icon: Police,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'medical':
        return {
          label: language === 'en' ? 'Medical' : 'वैद्यकीय',
          icon: Heart,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'fire':
        return {
          label: language === 'en' ? 'Fire' : 'आग',
          icon: Flame,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'disaster':
        return {
          label: language === 'en' ? 'Disaster' : 'आपत्ती',
          icon: AlertTriangle,
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'administration':
        return {
          label: language === 'en' ? 'Administration' : 'प्रशासन',
          icon: Building,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      case 'utility':
        return {
          label: language === 'en' ? 'Utility' : 'उपयुक्तता',
          icon: Zap,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          label: type,
          icon: Phone,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getAlertTypeInfo = (type: string) => {
    switch (type) {
      case 'weather':
        return {
          label: language === 'en' ? 'Weather' : 'हवामान',
          icon: Wind,
          color: 'text-cyan-600 bg-cyan-50'
        };
      case 'disaster':
        return {
          label: language === 'en' ? 'Disaster' : 'आपत्ती',
          icon: AlertTriangle,
          color: 'text-red-600 bg-red-50'
        };
      case 'health':
        return {
          label: language === 'en' ? 'Health' : 'आरोग्य',
          icon: Heart,
          color: 'text-pink-600 bg-pink-50'
        };
      case 'security':
        return {
          label: language === 'en' ? 'Security' : 'सुरक्षा',
          icon: Shield,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'utility':
        return {
          label: language === 'en' ? 'Utility' : 'उपयुक्तता',
          icon: Zap,
          color: 'text-yellow-600 bg-yellow-50'
        };
      case 'traffic':
        return {
          label: language === 'en' ? 'Traffic' : 'वाहतूक',
          icon: Car,
          color: 'text-orange-600 bg-orange-50'
        };
      default:
        return {
          label: type,
          icon: AlertTriangle,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'low':
        return {
          label: language === 'en' ? 'Low' : 'कमी',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'medium':
        return {
          label: language === 'en' ? 'Medium' : 'मध्यम',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Info
        };
      case 'high':
        return {
          label: language === 'en' ? 'High' : 'उच्च',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle
        };
      case 'critical':
        return {
          label: language === 'en' ? 'Critical' : 'गंभीर',
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return {
          label: severity,
          color: 'bg-gray-100 text-gray-800',
          icon: Info
        };
    }
  };

  const getResourceTypeInfo = (type: string) => {
    switch (type) {
      case 'shelter':
        return {
          label: language === 'en' ? 'Shelters' : 'आश्रयस्थाने',
          icon: Building,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'hospital':
        return {
          label: language === 'en' ? 'Hospitals' : 'रुग्णालये',
          icon: Heart,
          color: 'text-red-600 bg-red-50'
        };
      case 'police-station':
        return {
          label: language === 'en' ? 'Police Stations' : 'पोलीस स्टेशन',
          icon: Police,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'fire-station':
        return {
          label: language === 'en' ? 'Fire Stations' : 'आग विभाग स्टेशन',
          icon: Flame,
          color: 'text-orange-600 bg-orange-50'
        };
      case 'evacuation-center':
        return {
          label: language === 'en' ? 'Evacuation Centers' : 'सोडवण केंद्रे',
          icon: Users,
          color: 'text-purple-600 bg-purple-50'
        };
      case 'aid-center':
        return {
          label: language === 'en' ? 'Aid Centers' : 'मदत केंद्रे',
          icon: Shield,
          color: 'text-green-600 bg-green-50'
        };
      default:
        return {
          label: type,
          icon: Building,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  return (
    <section id="emergency" className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.emergency.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Emergency contacts, safety alerts, and disaster preparedness'
              : 'आपत्कालीन संपर्क, सुरक्षा सतर्कता आणि आपत्ती तयारी'
            }
          </p>
        </div>

        {/* Emergency Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalContacts}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Emergency Contacts' : 'आपत्कालीन संपर्क'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.activeAlerts}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Active Alerts' : 'सक्रिय सतर्कता'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.availableResources}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Available Resources' : 'उपलब्ध संसाधने'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.responseTime}min
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Response Time' : 'प्रतिसाद वेळ'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.safetyScore}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Safety Score' : 'सुरक्षा गुण'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-cyan-100 rounded-full flex items-center justify-center">
                <Call className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.emergencyCalls}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Emergency Calls' : 'आपत्कालीन कॉल'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Emergency Contacts' : 'आपत्कालीन संपर्क'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Contacts' : 'सर्व संपर्क पहा'}
            </Button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Emergency contacts will be updated soon'
                  : 'आपत्कालीन संपर्क लवकरच अद्यतनित केले जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedContacts).map(([type, typeContacts]) => {
                const typeInfo = getContactTypeInfo(type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={type} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color.split(' ')[1]}`}>
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {typeInfo.label}
                      </h4>
                      <Badge className={typeInfo.badgeColor}>
                        {typeContacts.length} {language === 'en' ? 'Contacts' : 'संपर्क'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeContacts.map((contact) => (
                        <Card key={contact.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                {language === 'en' ? contact.nameEn : contact.name}
                              </CardTitle>
                              {contact.isEmergency && (
                                <Badge className="bg-red-100 text-red-800">
                                  {language === 'en' ? 'Emergency' : 'आपत्कालीन'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {language === 'en' ? contact.descriptionEn : contact.description}
                            </p>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-gray-600 line-clamp-1">
                                  {language === 'en' ? contact.addressEn : contact.address}
                                </span>
                              </div>
                              {contact.responseTime && (
                                <div className="flex items-center text-sm">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-gray-600">
                                    {language === 'en' ? 'Response Time' : 'प्रतिसाद वेळ'}: {language === 'en' ? contact.responseTimeEn : contact.responseTime}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                size="sm"
                              >
                                <Call className="w-4 h-4 mr-2" />
                                {contact.phone}
                              </Button>
                              {contact.alternatePhone && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  {contact.alternatePhone}
                                </Button>
                              )}
                              {contact.email && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Email' : 'ईमेल'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Safety Alerts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Safety Alerts' : 'सुरक्षा सतर्कता'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Alerts' : 'सर्व सतर्कता पहा'}
            </Button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Safety alerts will be updated soon'
                  : 'सुरक्षा सतर्कता लवकरच अद्यतनित केल्या जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedAlerts).map(([type, typeAlerts]) => {
                const typeInfo = getAlertTypeInfo(type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={type} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color.split(' ')[1]}`}>
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {typeInfo.label}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {typeAlerts.length} {language === 'en' ? 'Alerts' : 'सतर्कता'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeAlerts.map((alert) => {
                        const severityInfo = getSeverityInfo(alert.severity);
                        const SeverityIcon = severityInfo.icon;
                        
                        return (
                          <Card key={alert.id} className="hover:shadow-lg transition-all duration-300 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                  {language === 'en' ? alert.titleEn : alert.title}
                                </CardTitle>
                                <Badge className={severityInfo.color}>
                                  <SeverityIcon className="w-3 h-3 mr-1" />
                                  {severityInfo.label}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {language === 'en' ? alert.descriptionEn : alert.description}
                              </p>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-gray-600">
                                    {language === 'en' ? alert.areaEn : alert.area}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-gray-600">
                                    {language === 'en' ? 'Start' : 'सुरुवात'}: {new Date(alert.startDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {alert.endDate && (
                                  <div className="flex items-center text-sm">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-gray-600">
                                      {language === 'en' ? 'End' : 'शेवट'}: {new Date(alert.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Button 
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'View Instructions' : 'सूचना पहा'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Download Alert' : 'सतर्कता डाउनलोड करा'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Safety Resources */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Safety Resources' : 'सुरक्षा संसाधने'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Resources' : 'सर्व संसाधने पहा'}
            </Button>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Safety resources will be updated soon'
                  : 'सुरक्षा संसाधने लवकरच अद्यतनित केली जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedResources).map(([type, typeResources]) => {
                const typeInfo = getResourceTypeInfo(type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={type} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color.split(' ')[1]}`}>
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {typeInfo.label}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {typeResources.length} {language === 'en' ? 'Resources' : 'संसाधने'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeResources.map((resource) => (
                        <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                {language === 'en' ? resource.titleEn : resource.title}
                              </CardTitle>
                              <Badge className={resource.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {resource.isAvailable ? (language === 'en' ? 'Available' : 'उपलब्ध') : (language === 'en' ? 'Unavailable' : 'अनुपलब्ध')}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {language === 'en' ? resource.descriptionEn : resource.description}
                            </p>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-gray-600 line-clamp-1">
                                  {language === 'en' ? resource.locationEn : resource.location}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Capacity' : 'क्षमता'}:
                                </span>
                                <span className="font-medium">
                                  {resource.currentOccupancy}/{resource.capacity}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Contact' : 'संपर्क'}:
                                </span>
                                <span className="font-medium">
                                  {resource.contact}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <Call className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Contact' : 'संपर्क करा'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'View Details' : 'तपशील पहा'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Emergency Preparedness */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Emergency Preparedness' : 'आपत्कालीन तयारी'}
                </h3>
                <p className="text-red-100">
                  {language === 'en' 
                    ? 'Be prepared for emergencies with our safety resources and guidelines'
                    : 'आमच्या सुरक्षा संसाधनांसह आणि मार्गदर्शक तत्त्वांसह आपत्कालीन परिस्थितीसाठी तयार रहा'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Safety Guidelines' : 'सुरक्षा मार्गदर्शक तत्त्वे'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'Learn essential safety procedures'
                      : 'आवश्यक सुरक्षा प्रक्रिया शिका'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Community Training' : 'समुदाय प्रशिक्षण'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'Join emergency response training'
                      : 'आपत्कालीन प्रतिसाद प्रशिक्षणात सामील व्हा'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Alert System' : 'सतर्कता प्रणाली'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'Stay informed with real-time alerts'
                      : 'वास्तविक वेळेच्या सतर्कतांसह माहितीत रहा'
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Learn More' : 'अधिक जाणून घ्या'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Phone className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View Emergency Dashboard' : 'आपत्कालीन डॅशबोर्ड पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}