'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdminContext } from '@/components/providers/admin-context';
import { 
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Users,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FormValidator, validateForm, getValidationMessage } from '@/lib/validation';

interface BasicInfo {
  grampanchayatName: string;
  taluka: string;
  population: number;
  families: number;
  gpoName: string;
  sarpanchName: string;
  establishmentYear: string;
  populationCategory: string;
}

export default function BasicInfoPage() {
  const router = useRouter();
  const { subdomainId } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [prePopulatedFields, setPrePopulatedFields] = useState<Set<string>>(new Set());
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    grampanchayatName: '',
    taluka: '',
    population: 0,
    families: 0,
    gpoName: '',
    sarpanchName: '',
    establishmentYear: '',
    populationCategory: 'below2000'
  });

  useEffect(() => {
    fetchBasicInfo();
  }, [subdomainId]);

  const fetchBasicInfo = async () => {
    try {
      setLoading(true);
      
      // Wait for subdomainId to be available
      if (!subdomainId) {
        console.log('Waiting for subdomainId...');
        return;
      }
      
      const response = await fetch(`/api/campaign-form/basic-info?subdomainId=${subdomainId}`);
      const data = await response.json();

      if (response.ok) {
        // Use the pre-populated basic info from API
        if (data.basicInfo) {
          setBasicInfo({
            grampanchayatName: data.basicInfo.grampanchayatName || '',
            taluka: data.basicInfo.taluka || '',
            population: data.basicInfo.population || 0,
            families: data.basicInfo.families || 0,
            gpoName: data.basicInfo.gpoName || '',
            sarpanchName: data.basicInfo.sarpanchName || '',
            establishmentYear: data.basicInfo.establishmentYear || '',
            populationCategory: data.basicInfo.populationCategory || 'below2000'
          });
          
          // Track which fields were pre-populated from existing village data
          if (!data.hasExistingData && data.subdomain) {
            const prePopulated = new Set<string>();
            if (data.basicInfo.grampanchayatName && data.basicInfo.grampanchayatName === data.subdomain.villageName) {
              prePopulated.add('grampanchayatName');
            }
            if (data.basicInfo.taluka && data.basicInfo.taluka === data.subdomain.subDistrictName) {
              prePopulated.add('taluka');
            }
            if (data.basicInfo.gpoName && data.basicInfo.gpoName === data.subdomain.contactPerson) {
              prePopulated.add('gpoName');
            }
            setPrePopulatedFields(prePopulated);
            
            if (prePopulated.size > 0) {
              toast.success(`${prePopulated.size} fields pre-populated from existing village data`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching basic info:', error);
      toast.error('Failed to load basic information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BasicInfo, value: string | number) => {
    setBasicInfo(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-determine population category based on population
      if (field === 'population') {
        const pop = typeof value === 'string' ? parseInt(value) || 0 : value;
        if (pop > 5000) {
          updated.populationCategory = 'above5000';
        } else if (pop > 2000) {
          updated.populationCategory = 'between2000_5000';
        } else {
          updated.populationCategory = 'below2000';
        }
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate the form
      const validator = new FormValidator('marathi');
      validator.validateBasicInfo(basicInfo);
      
      if (validator.hasErrors()) {
        setValidationErrors(validator.getErrors());
        toast.error('Please fix the validation errors');
        return;
      }
      
      const response = await fetch('/api/campaign-form/basic-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomainId,
          ...basicInfo
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Basic information saved successfully');
        setValidationErrors([]);
        router.push('/admin/campaign-form');
      } else {
        toast.error(data.error || 'Failed to save basic information');
      }
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Failed to save basic information');
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return basicInfo.grampanchayatName && 
           basicInfo.taluka && 
           basicInfo.population > 0 && 
           basicInfo.families > 0 && 
           basicInfo.gpoName && 
           basicInfo.sarpanchName;
  };

  const getPopulationCategoryText = (category: string) => {
    switch (category) {
      case 'below2000':
        return 'Below 2000';
      case 'between2000_5000':
        return '2000-5000';
      case 'above5000':
        return 'Above 5000';
      default:
        return 'Below 2000';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading basic information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaign-form">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Basic Information</h1>
            <p className="text-muted-foreground">
              Provide basic village information for the campaign form
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!isFormValid() || saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Information'}
        </Button>
      </div>

      {/* Pre-population Summary */}
      {prePopulatedFields.size > 0 && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Pre-populated Data</h3>
            </div>
            <p className="text-sm text-green-700 mb-3">
              The following fields have been automatically filled from your existing village data:
            </p>
            <div className="flex flex-wrap gap-2">
              {prePopulatedFields.has('grampanchayatName') && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Gram Panchayat Name
                </Badge>
              )}
              {prePopulatedFields.has('taluka') && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Taluka
                </Badge>
              )}
              {prePopulatedFields.has('gpoName') && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  GPO Name
                </Badge>
              )}
            </div>
            <p className="text-xs text-green-600 mt-2">
              You can modify these values if needed. Other fields need to be filled manually.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Village Information
            </CardTitle>
            <CardDescription>
              Basic details about your gram panchayat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="grampanchayatName" className="flex items-center gap-2">
                Gram Panchayat Name *
                {prePopulatedFields.has('grampanchayatName') && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Pre-filled from village data
                  </Badge>
                )}
              </Label>
              <Input
                id="grampanchayatName"
                value={basicInfo.grampanchayatName}
                onChange={(e) => handleInputChange('grampanchayatName', e.target.value)}
                placeholder="Enter gram panchayat name"
                required
                className={getValidationMessage('grampanchayatName', validationErrors) ? 'border-red-500' : ''}
              />
              {getValidationMessage('grampanchayatName', validationErrors) && (
                <p className="text-sm text-red-500 mt-1">
                  {getValidationMessage('grampanchayatName', validationErrors)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="taluka" className="flex items-center gap-2">
                Taluka *
                {prePopulatedFields.has('taluka') && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Pre-filled from village data
                  </Badge>
                )}
              </Label>
              <Input
                id="taluka"
                value={basicInfo.taluka}
                onChange={(e) => handleInputChange('taluka', e.target.value)}
                placeholder="Enter taluka name"
                required
                className={getValidationMessage('taluka', validationErrors) ? 'border-red-500' : ''}
              />
              {getValidationMessage('taluka', validationErrors) && (
                <p className="text-sm text-red-500 mt-1">
                  {getValidationMessage('taluka', validationErrors)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="population">Population *</Label>
                <Input
                  id="population"
                  type="number"
                  value={basicInfo.population}
                  onChange={(e) => handleInputChange('population', parseInt(e.target.value) || 0)}
                  placeholder="Enter population"
                  required
                />
              </div>
              <div>
                <Label htmlFor="families">Number of Families *</Label>
                <Input
                  id="families"
                  type="number"
                  value={basicInfo.families}
                  onChange={(e) => handleInputChange('families', parseInt(e.target.value) || 0)}
                  placeholder="Enter number of families"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="establishmentYear">Establishment Year</Label>
              <Input
                id="establishmentYear"
                value={basicInfo.establishmentYear}
                onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
                placeholder="Enter establishment year"
              />
            </div>
          </CardContent>
        </Card>

        {/* Administrative Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrative Information
            </CardTitle>
            <CardDescription>
              Key administrative personnel details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gpoName" className="flex items-center gap-2">
                Gram Panchayat Officer Name *
                {prePopulatedFields.has('gpoName') && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Pre-filled from village data
                  </Badge>
                )}
              </Label>
              <Input
                id="gpoName"
                value={basicInfo.gpoName}
                onChange={(e) => handleInputChange('gpoName', e.target.value)}
                placeholder="Enter GPO name"
                required
              />
            </div>

            <div>
              <Label htmlFor="sarpanchName">Sarpanch Name *</Label>
              <Input
                id="sarpanchName"
                value={basicInfo.sarpanchName}
                onChange={(e) => handleInputChange('sarpanchName', e.target.value)}
                placeholder="Enter sarpanch name"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Population Category Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Population Category
          </CardTitle>
          <CardDescription>
            Automatically determined based on population
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              {getPopulationCategoryText(basicInfo.populationCategory)}
            </div>
            <div className="text-sm text-muted-foreground">
              This category will be used to determine targets for various form items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isFormValid() ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            Form Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFormValid() ? (
            <div className="text-green-600">
              <p className="font-medium">All required fields are completed</p>
              <p className="text-sm text-muted-foreground">
                You can now proceed to fill the campaign form
              </p>
            </div>
          ) : (
            <div className="text-yellow-600">
              <p className="font-medium">Please complete all required fields</p>
              <p className="text-sm text-muted-foreground">
                Fields marked with * are mandatory
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
