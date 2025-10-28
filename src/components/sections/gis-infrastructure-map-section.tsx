'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Map, 
  Satellite, 
  Layers,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  Navigation,
  Info,
  Phone,
  Clock,
  Users
} from 'lucide-react';
import { useState } from 'react';

interface InfrastructureFacility {
  id: string;
  name: string;
  nameEn: string;
  type: 'water' | 'sanitation' | 'road' | 'school' | 'health' | 'library' | 'playground' | 'bus_stop' | 'other';
  category: string;
  status: 'operational' | 'maintenance' | 'non-functional';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacity: string;
  contactInfo: string;
  workingHours: string;
  lastMaintenance: string;
  description: string;
  services: string[];
}

interface GISInfrastructureMapSectionProps {
  facilities?: InfrastructureFacility[];
}

export default function GISInfrastructureMapSection({ facilities = [] }: GISInfrastructureMapSectionProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('satellite');
  const [selectedFacility, setSelectedFacility] = useState<InfrastructureFacility | null>(null);

  // Demo data for when no facilities are available
  const demoFacilities: InfrastructureFacility[] = [
    {
      id: 'facility-1',
      name: 'पाणी शोधन केंद्र',
      nameEn: 'Water Treatment Plant',
      type: 'water',
      category: 'पाणीपुरवठा',
      status: 'operational',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'गावाच्या पूर्व भागात'
      },
      capacity: '25,000 लिटर/दिवस',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '24/7',
      lastMaintenance: '2024-11-15',
      description: 'गावातील पाणी शोधन आणि पुरवठा केंद्र',
      services: ['पाणी शोधन', 'पाणी साठवण', 'पाणी वितरण']
    },
    {
      id: 'facility-2',
      name: 'प्राथमिक शाळा',
      nameEn: 'Primary School',
      type: 'school',
      category: 'शिक्षण',
      status: 'operational',
      location: {
        lat: 19.0765,
        lng: 72.8780,
        address: 'गावाच्या मध्य भागात'
      },
      capacity: '200 विद्यार्थी',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '8:00 AM - 4:00 PM',
      lastMaintenance: '2024-11-10',
      description: 'गावातील मुख्य प्राथमिक शाळा',
      services: ['प्राथमिक शिक्षण', 'मध्यान्ह भोजन', 'पुस्तकालय']
    },
    {
      id: 'facility-3',
      name: 'प्राथमिक आरोग्य केंद्र',
      nameEn: 'Primary Health Center',
      type: 'health',
      category: 'आरोग्य',
      status: 'operational',
      location: {
        lat: 19.0755,
        lng: 72.8775,
        address: 'ग्रामपंचायत कार्यालयजवळ'
      },
      capacity: '50 रुग्ण',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '9:00 AM - 5:00 PM',
      lastMaintenance: '2024-11-20',
      description: 'गावातील मुख्य आरोग्य केंद्र',
      services: ['सामान्य उपचार', 'लसीकरण', 'प्रसूती सेवा']
    },
    {
      id: 'facility-4',
      name: 'सार्वजनिक वाचनालय',
      nameEn: 'Public Library',
      type: 'library',
      category: 'सामुदायिक',
      status: 'operational',
      location: {
        lat: 19.0762,
        lng: 72.8778,
        address: 'सामुदायिक भवनात'
      },
      capacity: '100 वाचक',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '10:00 AM - 6:00 PM',
      lastMaintenance: '2024-11-25',
      description: 'गावातील सार्वजनिक वाचनालय',
      services: ['पुस्तके', 'वाचन कक्ष', 'संगणक केंद्र']
    },
    {
      id: 'facility-5',
      name: 'खेळाचे मैदान',
      nameEn: 'Playground',
      type: 'playground',
      category: 'मनोरंजन',
      status: 'operational',
      location: {
        lat: 19.0768,
        lng: 72.8782,
        address: 'शाळेजवळ'
      },
      capacity: '200 खेळाडू',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '6:00 AM - 8:00 PM',
      lastMaintenance: '2024-11-30',
      description: 'गावातील मुख्य खेळाचे मैदान',
      services: ['क्रिकेट', 'फुटबॉल', 'व्हॉलीबॉल', 'बास्केटबॉल']
    },
    {
      id: 'facility-6',
      name: 'बस थांबा',
      nameEn: 'Bus Stop',
      type: 'bus_stop',
      category: 'वाहतूक',
      status: 'operational',
      location: {
        lat: 19.0758,
        lng: 72.8772,
        address: 'मुख्य रस्त्यावर'
      },
      capacity: '50 प्रवाशी',
      contactInfo: '+91-XXXX-XXXXXX',
      workingHours: '24/7',
      lastMaintenance: '2024-12-01',
      description: 'गावातील मुख्य बस थांबा',
      services: ['बस सेवा', 'ऑटो रिक्शा', 'टॅक्सी']
    }
  ];

  const displayFacilities = facilities.length > 0 ? facilities : demoFacilities;

  const facilityTypes = [
    { value: 'all', label: 'सर्व', labelEn: 'All', color: 'bg-gray-500' },
    { value: 'water', label: 'पाणी', labelEn: 'Water', color: 'bg-blue-500' },
    { value: 'sanitation', label: 'स्वच्छता', labelEn: 'Sanitation', color: 'bg-green-500' },
    { value: 'road', label: 'रस्ते', labelEn: 'Roads', color: 'bg-gray-600' },
    { value: 'school', label: 'शाळा', labelEn: 'Schools', color: 'bg-blue-600' },
    { value: 'health', label: 'आरोग्य', labelEn: 'Health', color: 'bg-red-500' },
    { value: 'library', label: 'वाचनालय', labelEn: 'Library', color: 'bg-purple-500' },
    { value: 'playground', label: 'मैदान', labelEn: 'Playground', color: 'bg-green-600' },
    { value: 'bus_stop', label: 'बस थांबा', labelEn: 'Bus Stop', color: 'bg-orange-500' },
    { value: 'other', label: 'इतर', labelEn: 'Other', color: 'bg-gray-500' }
  ];

  const getTypeInfo = (type: string) => {
    return facilityTypes.find(t => t.value === type) || facilityTypes[0];
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          label: 'चालू',
          labelEn: 'Operational',
          color: 'text-green-600 bg-green-100',
          icon: '✓'
        };
      case 'maintenance':
        return {
          label: 'देखभाल',
          labelEn: 'Maintenance',
          color: 'text-yellow-600 bg-yellow-100',
          icon: '⚠'
        };
      case 'non-functional':
        return {
          label: 'बंद',
          labelEn: 'Non-functional',
          color: 'text-red-600 bg-red-100',
          icon: '✗'
        };
      default:
        return {
          label: 'अज्ञात',
          labelEn: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: '?'
        };
    }
  };

  const filteredFacilities = selectedType === 'all' 
    ? displayFacilities 
    : displayFacilities.filter(facility => facility.type === selectedType);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-indigo-100">
            <Map className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            ग्राम पायाभूत नकाशा
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
            GIS-style Village Infrastructure Map
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          गावातील सर्व सुविधांचा इंटरअॅक्टिव्ह नकाशा - क्लिक करण्यायोग्य चिन्हांसह
        </p>
      </div>

      {/* Map Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {facilityTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Map View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={mapView === 'satellite' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('satellite')}
              >
                <Satellite className="h-4 w-4 mr-2" />
                सॅटेलाईट
              </Button>
              <Button
                variant={mapView === 'street' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('street')}
              >
                <Map className="h-4 w-4 mr-2" />
                स्ट्रीट
              </Button>
              <Button
                variant={mapView === 'hybrid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('hybrid')}
              >
                <Layers className="h-4 w-4 mr-2" />
                हायब्रीड
              </Button>
            </div>

            {/* Map Controls */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            {/* Map Placeholder */}
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200 opacity-50"></div>
              
              {/* Mock Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 opacity-60"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-600 opacity-60"></div>
              
              {/* Facility Markers */}
              {filteredFacilities.map((facility, index) => {
                const typeInfo = getTypeInfo(facility.type);
                const statusInfo = getStatusInfo(facility.status);
                const x = 20 + (index * 15) % 60;
                const y = 20 + (index * 20) % 60;
                
                return (
                  <div
                    key={facility.id}
                    className="absolute cursor-pointer group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setSelectedFacility(facility)}
                  >
                    <div className={`w-8 h-8 rounded-full ${typeInfo.color} flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform`}>
                      {typeInfo.label.charAt(0)}
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {facility.name}
                    </div>
                  </div>
                );
              })}
              
              {/* Map Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>गाव नकाशा</span>
                  <Badge variant="outline" className="text-xs">
                    {mapView === 'satellite' ? 'सॅटेलाईट' : mapView === 'street' ? 'स्ट्रीट' : 'हायब्रीड'}
                  </Badge>
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">सुविधा चिन्हे</div>
                <div className="space-y-1">
                  {facilityTypes.slice(1, 6).map((type) => (
                    <div key={type.value} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Facility Details */}
      {selectedFacility && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                {selectedFacility.name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFacility(null)}
              >
                ✕
              </Button>
            </div>
            <p className="text-gray-600">{selectedFacility.nameEn}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{selectedFacility.location.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">क्षमता: {selectedFacility.capacity}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">कामाचे तास: {selectedFacility.workingHours}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{selectedFacility.contactInfo}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">सेवा</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedFacility.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">वर्णन</h4>
                  <p className="text-sm text-gray-600">{selectedFacility.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facilities List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            सुविधा यादी ({filteredFacilities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacilities.map((facility) => {
              const typeInfo = getTypeInfo(facility.type);
              const statusInfo = getStatusInfo(facility.status);
              
              return (
                <div
                  key={facility.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedFacility(facility)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${typeInfo.color}`}></div>
                      <h4 className="font-semibold text-gray-900 text-sm">{facility.name}</h4>
                    </div>
                    <Badge className={`${statusInfo.color} text-xs`}>
                      {statusInfo.icon} {statusInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{facility.nameEn}</p>
                  <p className="text-xs text-gray-600">{facility.location.address}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
