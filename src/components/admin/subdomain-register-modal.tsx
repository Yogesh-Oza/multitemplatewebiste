'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Save, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Mail,
  User,
  MapPin
} from 'lucide-react';
import { useVillageData } from '@/hooks/useVillageData';

interface SubdomainFormData {
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  villageId: string;
  villageNameLocal: string;
  sendEmail: boolean;
}

interface SubdomainRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubdomainCreated: () => void;
}

export default function SubdomainRegisterModal({
  isOpen,
  onClose,
  onSubdomainCreated
}: SubdomainRegisterModalProps) {
  const [formData, setFormData] = useState<SubdomainFormData>({
    subdomain: '',
    villageName: '',
    villageNameEn: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    districtId: '',
    districtName: '',
    subDistrictId: '',
    subDistrictName: '',
    villageId: '',
    villageNameLocal: '',
    sendEmail: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<{[key: string]: boolean}>({});
  const [villageSearchTerm, setVillageSearchTerm] = useState('');

  // Use the village data hook
  const {
    districts,
    subDistricts,
    villages,
    loading: villageLoading,
    error: villageError,
    fetchSubDistricts,
    fetchVillages,
    clearSubDistricts,
    clearVillages
  } = useVillageData();

  const validateSubdomain = (subdomain: string) => {
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 20;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const withCountryCode = cleanPhone.startsWith('91') && indianMobileRegex.test(cleanPhone.slice(2));
    return indianMobileRegex.test(cleanPhone) || withCountryCode;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle district/subdistrict/village cascading
    if (field === 'districtId') {
      const district = districts.find(d => d.id === value);
      setFormData(prev => ({
        ...prev,
        districtId: value,
        districtName: district?.name || '',
        subDistrictId: '',
        subDistrictName: '',
        villageId: '',
        villageNameLocal: ''
      }));
      // Clear sub-districts and villages when district changes
      clearSubDistricts();
      clearVillages();
      // Fetch sub-districts for selected district
      if (value) {
        fetchSubDistricts(value);
      }
    } else if (field === 'subDistrictId') {
      const subDistrict = subDistricts.find(sd => sd.id === value);
      setFormData(prev => ({
        ...prev,
        subDistrictId: value,
        subDistrictName: subDistrict?.name || '',
        villageId: '',
        villageNameLocal: ''
      }));
      // Clear villages when sub-district changes
      clearVillages();
      // Fetch villages for selected sub-district
      if (value) {
        fetchVillages(value, villageSearchTerm);
      }
    } else if (field === 'villageId') {
      const village = villages.find(v => v.id === value);
      setFormData(prev => ({
        ...prev,
        villageId: value,
        villageNameLocal: village?.name || ''
      }));
    }
  };

  const checkAvailability = async (field: string, value: string) => {
    if (!value) return;

    setIsCheckingAvailability(prev => ({ ...prev, [field]: true }));

    try {
      const response = await fetch(`/api/validate-subdomain?${field}=${encodeURIComponent(value)}`);
      const data = await response.json();
      
      if (!data.available) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: data.message || `${field} already exists`
        }));
      }
    } catch (error) {
    } finally {
      setIsCheckingAvailability(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const errors: {[key: string]: string} = {};
    
    if (!validateSubdomain(formData.subdomain)) {
      errors.subdomain = 'Invalid subdomain format';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/super-admin/subdomains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sendEmail: formData.sendEmail
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subdomain');
      }

      onSubdomainCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Add New Subdomain
            </CardTitle>
            <CardDescription>
              Create a new village subdomain with admin access
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subdomain Input */}
            <div className="space-y-2">
              <Label htmlFor="subdomain">सबडोमेन नाव</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => handleFieldChange('subdomain', e.target.value.toLowerCase())}
                  placeholder="आपल्या-गावाचे-नाव"
                  className={`flex-1 ${validationErrors.subdomain ? 'border-red-500' : ''}`}
                  required
                />
                <Badge variant="outline" className="whitespace-nowrap">
                  .mahagp.in
                </Badge>
              </div>
              <p className={`text-sm ${validationErrors.subdomain ? 'text-red-500' : 'text-gray-500'}`}>
                {validationErrors.subdomain || 'फक्त लोअरकेस अक्षरे, संख्या आणि हायफन परवानगी (3-20 अक्षरे)'}
              </p>
              {isCheckingAvailability.subdomain && (
                <p className="text-sm text-blue-500">तपासत आहे...</p>
              )}
            </div>

            {/* Village Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="villageName">गावाचे नाव (मराठी)</Label>
                <Input
                  id="villageName"
                  value={formData.villageName}
                  onChange={(e) => setFormData({...formData, villageName: e.target.value})}
                  placeholder="गावाचे नाव"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="villageNameEn">गावाचे नाव (इंग्रजी)</Label>
                <Input
                  id="villageNameEn"
                  value={formData.villageNameEn}
                  onChange={(e) => setFormData({...formData, villageNameEn: e.target.value})}
                  placeholder="Village Name"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                संपर्क माहिती
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">संपर्क व्यक्ती</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="पूर्ण नाव"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">फोन नंबर</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className={validationErrors.phone ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                  {isCheckingAvailability.phone && (
                    <p className="text-sm text-blue-500">तपासत आहे...</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ईमेल पत्ता</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="village@example.com"
                  className={validationErrors.email ? 'border-red-500' : ''}
                  required
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">{validationErrors.email}</p>
                )}
                {isCheckingAvailability.email && (
                  <p className="text-sm text-blue-500">तपासत आहे...</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                पत्ता माहिती
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">पूर्ण पत्ता</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="गाव, तालुका, जिल्हा, महाराष्ट्र"
                  rows={3}
                  required
                />
              </div>

              {/* District Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="districtId">जिल्हा</Label>
                  <select
                    id="districtId"
                    value={formData.districtId}
                    onChange={(e) => handleFieldChange('districtId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={villageLoading.districts}
                  >
                    <option value="">जिल्हा निवडा</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {villageLoading.districts && (
                    <p className="text-sm text-blue-500">Loading districts...</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subDistrictId">तालुका</Label>
                  <select
                    id="subDistrictId"
                    value={formData.subDistrictId}
                    onChange={(e) => handleFieldChange('subDistrictId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.districtId || villageLoading.subDistricts}
                  >
                    <option value="">तालुका निवडा</option>
                    {subDistricts.map((subDistrict) => (
                      <option key={subDistrict.id} value={subDistrict.id}>
                        {subDistrict.name}
                      </option>
                    ))}
                  </select>
                  {villageLoading.subDistricts && (
                    <p className="text-sm text-blue-500">Loading sub-districts...</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="villageId">गाव</Label>
                  
                  {/* Village Search Input */}
                  {formData.subDistrictId && (
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="Search villages..."
                        value={villageSearchTerm}
                        onChange={(e) => {
                          setVillageSearchTerm(e.target.value);
                          // Debounce the search
                          setTimeout(() => {
                            if (formData.subDistrictId) {
                              fetchVillages(formData.subDistrictId, e.target.value);
                            }
                          }, 300);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}
                  
                  <select
                    id="villageId"
                    value={formData.villageId}
                    onChange={(e) => handleFieldChange('villageId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.subDistrictId || villageLoading.villages}
                  >
                    <option value="">गाव निवडा</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                  
                  {villageLoading.villages && (
                    <p className="text-sm text-blue-500">Loading villages...</p>
                  )}
                  
                  {villageSearchTerm && villages.length === 0 && !villageLoading.villages && (
                    <p className="text-sm text-gray-500">No villages found matching "{villageSearchTerm}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="description">अतिरिक्त माहिती</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="गावाबद्दल अतिरिक्त माहिती (वैकल्पिक)"
                rows={3}
              />
            </div>

            {/* Email Notification Checkbox */}
            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="sendEmail" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Send email notification to user with admin credentials
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Create Subdomain
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
