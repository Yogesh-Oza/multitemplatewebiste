'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Edit, 
  Save,
  ArrowLeft,
  MapPin,
  Mail,
  Globe,
  Clock,
  Building,
  User,
  Plus,
  Trash2,
  Upload,
  Users,
  Map
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface OfficeDetails {
  id?: string;
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  workingHours: string;
  workingHoursEn: string;
  isActive: boolean;
}

interface TeamMember {
  id?: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  phone: string;
  email?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

interface MapSettings {
  id?: string;
  embedUrl: string;
  latitude?: string;
  longitude?: string;
  isActive: boolean;
}

const teamDesignations = [
  { value: 'सरपंच', label: 'सरपंच', labelEn: 'Sarpanch' },
  { value: 'उपसरपंच', label: 'उपसरपंच', labelEn: 'Up-Sarpanch' },
  { value: 'ग्रामसेवक', label: 'ग्रामसेवक', labelEn: 'Gramsevak' }
];

export default function ContactPage() {
  const [officeDetails, setOfficeDetails] = useState<OfficeDetails>({
    address: '',
    addressEn: '',
    phone: '',
    email: '',
    workingHours: '',
    workingHoursEn: '',
    isActive: true
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
  
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    embedUrl: '',
    latitude: '',
    longitude: '',
    isActive: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch office details
        const officeResponse = await fetch('/api/office-details');
        if (officeResponse.ok) {
          const officeData = await officeResponse.json();
          if (officeData) {
            setOfficeDetails(officeData);
          }
        }

        // Fetch team members
        const teamResponse = await fetch('/api/team-members');
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData);
        }

        // Fetch map settings
        const mapResponse = await fetch('/api/map-settings');
        if (mapResponse.ok) {
          const mapData = await mapResponse.json();
          if (mapData) {
            setMapSettings(mapData);
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        toast.error('संपर्क माहिती लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Office Details Handlers
  const handleOfficeDetailsChange = (field: keyof OfficeDetails, value: string | boolean) => {
    setOfficeDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOfficeDetails = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/office-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(officeDetails),
      });

      if (response.ok) {
        toast.success('कार्यालय माहिती सेव्ह केली');
      } else {
        throw new Error('Failed to save office details');
      }
    } catch (error) {
      console.error('Error saving office details:', error);
      toast.error('कार्यालय माहिती सेव्ह करताना त्रुटी आली');
    } finally {
      setIsSaving(false);
    }
  };

  // Team Members Handlers
  const handleAddTeamMember = () => {
    setEditingTeamMember({
      name: '',
      nameEn: '',
      designation: 'सरपंच',
      designationEn: 'Sarpanch',
      phone: '',
      email: '',
      imageUrl: '',
      isActive: true,
      order: teamMembers.length
    });
    setIsAddingTeamMember(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsAddingTeamMember(false);
  };

  const handleSaveTeamMember = async () => {
    if (!editingTeamMember) return;

    try {
      if (isAddingTeamMember) {
        const response = await fetch('/api/team-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingTeamMember),
        });

        if (response.ok) {
          const newMember = await response.json();
          setTeamMembers(prev => [...prev, newMember]);
          toast.success('नवीन सदस्य जोडले');
        } else {
          throw new Error('Failed to create team member');
        }
      } else {
        const response = await fetch(`/api/team-members/${editingTeamMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingTeamMember),
        });

        if (response.ok) {
          const updatedMember = await response.json();
          setTeamMembers(prev => prev.map(member => 
            member.id === updatedMember.id ? updatedMember : member
          ));
          toast.success('सदस्य अपडेट केले');
        } else {
          throw new Error('Failed to update team member');
        }
      }

      setEditingTeamMember(null);
      setIsAddingTeamMember(false);
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('सदस्य सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTeamMembers(prev => prev.filter(member => member.id !== id));
        toast.success('सदस्य हटवले');
      } else {
        throw new Error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('सदस्य हटवताना त्रुटी आली');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया फक्त प्रतिमा फाइल निवडा');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setEditingTeamMember(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
        toast.success('प्रतिमा अपलोड केली');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'अपलोड अयशस्वी');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'अपलोड अयशस्वी');
    } finally {
      (event.target as HTMLInputElement).value = '';
    }
  };

  // Map Settings Handlers
  const handleMapSettingsChange = (field: keyof MapSettings, value: string | boolean) => {
    setMapSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMapSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/map-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapSettings),
      });

      if (response.ok) {
        toast.success('नकाशा सेटिंग्स सेव्ह केली');
      } else {
        throw new Error('Failed to save map settings');
      }
    } catch (error) {
      console.error('Error saving map settings:', error);
      toast.error('नकाशा सेटिंग्स सेव्ह करताना त्रुटी आली');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoCalculateCoordinates = () => {
    if (!mapSettings.embedUrl) {
      toast.error('कृपया पहिले Google Maps embed URL प्रविष्ट करा');
      return;
    }

    try {
      // Extract coordinates from embed URL
      const extractCoordinates = (url: string) => {
        // Handle different Google Maps URL formats
        if (url.includes('maps.app.goo.gl')) {
          toast.warning('goo.gl शॉर्ट URL मधून निर्देशांक काढू शकत नाही. कृपया पूर्ण embed URL वापरा.');
          return null;
        }
        
        // Extract coordinates from embed URL patterns
        const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (coordMatch) {
          return {
            latitude: coordMatch[1],
            longitude: coordMatch[2]
          };
        }
        
        // Try to extract from query parameters
        const urlObj = new URL(url);
        const ll = urlObj.searchParams.get('ll');
        if (ll) {
          const [lat, lng] = ll.split(',');
          return { latitude: lat, longitude: lng };
        }
        
        return null;
      };

      const coordinates = extractCoordinates(mapSettings.embedUrl);
      
      if (coordinates) {
        setMapSettings(prev => ({
          ...prev,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }));
        toast.success('निर्देशांक स्वयंचलित काढले गेले!');
      } else {
        toast.error('URL मधून निर्देशांक काढू शकत नाही. कृपया मॅन्युअली प्रविष्ट करा.');
      }
    } catch (error) {
      console.error('Error extracting coordinates:', error);
      toast.error('निर्देशांक काढताना त्रुटी आली');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">संपर्क व्यवस्थापन</h1>
          <p className="text-gray-600 mt-1">कार्यालय माहिती, ग्राम पंचायत कार्यकारणी आणि नकाशा व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {teamMembers.length} सदस्य
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {teamMembers.filter(m => m.isActive).length} सक्रिय
          </Badge>
        </div>
      </div>

      {/* Office Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>कार्यालय माहिती</span>
          </CardTitle>
          <CardDescription>कार्यालयाचा पत्ता, फोन, ईमेल आणि कार्यवेळ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">कार्यालयाचा पत्ता (मराठी)</Label>
              <Textarea
                id="address"
                value={officeDetails.address}
                onChange={(e) => handleOfficeDetailsChange('address', e.target.value)}
                placeholder="NEAR SUNDER NAGARI 309 SOMWAR PETH JOSHI WADA PU"
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addressEn">कार्यालयाचा पत्ता (इंग्रजी)</Label>
              <Textarea
                id="addressEn"
                value={officeDetails.addressEn}
                onChange={(e) => handleOfficeDetailsChange('addressEn', e.target.value)}
                placeholder="Office Address in English"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">फोन क्रमांक</Label>
              <Input
                id="phone"
                value={officeDetails.phone}
                onChange={(e) => handleOfficeDetailsChange('phone', e.target.value)}
                placeholder="+911234567488"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">ईमेल पत्ता</Label>
              <Input
                id="email"
                type="email"
                value={officeDetails.email}
                onChange={(e) => handleOfficeDetailsChange('email', e.target.value)}
                placeholder="yogeshoza33333@gmail.com"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workingHours">कार्यालयीन वेळा (मराठी)</Label>
              <Input
                id="workingHours"
                value={officeDetails.workingHours}
                onChange={(e) => handleOfficeDetailsChange('workingHours', e.target.value)}
                placeholder="सकाळी ८:०० ते संध्याकाळी ४:००"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="workingHoursEn">कार्यालयीन वेळा (इंग्रजी)</Label>
              <Input
                id="workingHoursEn"
                value={officeDetails.workingHoursEn}
                onChange={(e) => handleOfficeDetailsChange('workingHoursEn', e.target.value)}
                placeholder="8:00 AM to 4:00 PM"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveOfficeDetails} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'सेव्ह करत आहे...' : 'कार्यालय माहिती सेव्ह करा'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>ग्राम पंचायत कार्यकारणी</span>
              </CardTitle>
              <CardDescription>गावाच्या विकासासाठी समर्पित आणि अनुभवी नेतृत्व</CardDescription>
            </div>
            <Button onClick={handleAddTeamMember} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              नवीन सदस्य
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.designation}</CardDescription>
                      </div>
                    </div>
                    <Badge className={member.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                      {member.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                    {member.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTeamMember(member)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादन
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTeamMember(member.id!)}
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-purple-600" />
            <span>नकाशा सेटिंग्स</span>
          </CardTitle>
          <CardDescription>Google Maps embed URL आणि स्थान माहिती</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="embedUrl">Google Maps Embed URL</Label>
            <Textarea
              id="embedUrl"
              value={mapSettings.embedUrl}
              onChange={(e) => handleMapSettingsChange('embedUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              rows={4}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Google Maps वरून "Share" → "Embed a map" → "Copy HTML" करून URL कॉपी करा
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">अक्षांश (Latitude)</Label>
              <Input
                id="latitude"
                value={mapSettings.latitude || ''}
                onChange={(e) => handleMapSettingsChange('latitude', e.target.value)}
                placeholder="18.5204"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="longitude">रेखांश (Longitude)</Label>
              <Input
                id="longitude"
                value={mapSettings.longitude || ''}
                onChange={(e) => handleMapSettingsChange('longitude', e.target.value)}
                placeholder="73.8567"
                className="mt-1"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Map className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">स्वयंचलित निर्देशांक</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Google Maps embed URL मधून निर्देशांक स्वयंचलित काढण्यासाठी खालील बटण वापरा:
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoCalculateCoordinates}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Map className="h-4 w-4 mr-2" />
              निर्देशांक स्वयंचलित काढा
            </Button>
            <p className="text-xs text-blue-600 mt-2">
              * हे फंक्शन काही URL प्रकारांसाठी काम करत नाही (उदा: goo.gl शॉर्ट URL)
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveMapSettings} 
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'सेव्ह करत आहे...' : 'नकाशा सेटिंग्स सेव्ह करा'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Member Edit Modal */}
      {editingTeamMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAddingTeamMember ? 'नवीन सदस्य जोडा' : 'सदस्य संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाव (मराठी)</Label>
                  <Input
                    id="name"
                    value={editingTeamMember.name}
                    onChange={(e) => setEditingTeamMember({...editingTeamMember, name: e.target.value})}
                    placeholder="सरपंच नाव"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">नाव (इंग्रजी)</Label>
                  <Input
                    id="nameEn"
                    value={editingTeamMember.nameEn}
                    onChange={(e) => setEditingTeamMember({...editingTeamMember, nameEn: e.target.value})}
                    placeholder="Sarpanch Name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">पद (मराठी)</Label>
                  <select
                    id="designation"
                    value={editingTeamMember.designation}
                    onChange={(e) => {
                      const selected = teamDesignations.find(d => d.value === e.target.value);
                      setEditingTeamMember({
                        ...editingTeamMember, 
                        designation: e.target.value,
                        designationEn: selected?.labelEn || ''
                      });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    {teamDesignations.map((designation) => (
                      <option key={designation.value} value={designation.value}>
                        {designation.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">फोन क्रमांक</Label>
                  <Input
                    id="phone"
                    value={editingTeamMember.phone}
                    onChange={(e) => setEditingTeamMember({...editingTeamMember, phone: e.target.value})}
                    placeholder="+91 XXXXX-XXXXX"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">ईमेल (वैकल्पिक)</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingTeamMember.email || ''}
                  onChange={(e) => setEditingTeamMember({...editingTeamMember, email: e.target.value})}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा (वैकल्पिक)</Label>
                <div className="space-y-3">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">प्रतिमा अपलोड</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500">JPG, PNG, WebP, कमाल 10MB</p>

                  {editingTeamMember.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">अपलोड केलेली प्रतिमा:</p>
                      <div className="relative inline-block">
                        <img
                          src={editingTeamMember.imageUrl}
                          alt="Uploaded preview"
                          className="max-w-xs max-h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingTeamMember(prev => prev ? { ...prev, imageUrl: '' } : null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => {setEditingTeamMember(null); setIsAddingTeamMember(false);}}>
                  रद्द करा
                </Button>
                <Button onClick={handleSaveTeamMember} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}