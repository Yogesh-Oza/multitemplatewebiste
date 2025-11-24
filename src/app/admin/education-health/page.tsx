'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, GraduationCap, Heart, Phone, MapPin, Check, X, School, Baby, Stethoscope, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  educationHealthDemoSnapshot,
  educationHealthDemoFacilities,
  EducationHealthSnapshotData,
  EducationHealthFacilityData
} from '@/lib/demo-education-health';

const emptyFacility: EducationHealthFacilityData = {
  title: '',
  titleEn: '',
  type: 'school',
  status: 'operational',
  statusEn: 'Operational',
  location: '',
  locationEn: '',
  capacity: '',
  staff: 0,
  lastInspection: '',
  contactNumber: '',
  contactLabel: 'संपर्क माहिती',
  contactLabelEn: 'Contact Information',
  actionLabel: 'कॉल करा',
  actionLabelEn: 'Call Now',
  services: [],
  order: 0,
  isActive: true
};

export default function EducationHealthAdminPage() {
  const [loading, setLoading] = useState(true);
  const [snapshotForm, setSnapshotForm] = useState<EducationHealthSnapshotData>(educationHealthDemoSnapshot);
  const [facilities, setFacilities] = useState<EducationHealthFacilityData[]>(educationHealthDemoFacilities);
  const [isDemo, setIsDemo] = useState(true);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [facilityForm, setFacilityForm] = useState<EducationHealthFacilityData>(emptyFacility);
  const [editingFacility, setEditingFacility] = useState<EducationHealthFacilityData | null>(null);
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/education-health');
      if (response.ok) {
        const data = await response.json();
        setSnapshotForm(data.snapshot || educationHealthDemoSnapshot);
        setFacilities(
          (data.facilities?.length ? data.facilities : educationHealthDemoFacilities).sort(
            (a: EducationHealthFacilityData, b: EducationHealthFacilityData) => (a.order ?? 0) - (b.order ?? 0)
          )
        );
        setIsDemo(Boolean(data.isDemo));
      } else {
        toast.error('डेटा लोड करताना त्रुटी आली');
      }
    } catch (error) {
      console.error(error);
      toast.error('डेटा लोड करताना त्रुटी आली');
    } finally {
      setLoading(false);
    }
  };

  const handleSnapshotSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSavingSnapshot(true);
      const response = await fetch('/api/education-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'snapshot', payload: snapshotForm })
      });

      if (!response.ok) {
        throw new Error('Failed to save snapshot');
      }

      toast.success('विभाग माहिती जतन केली');
      setIsDemo(false);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('माहिती जतन करण्यात अडचण आली');
    } finally {
      setSavingSnapshot(false);
    }
  };

  const resetFacilityForm = () => {
    setEditingFacility(null);
    setFacilityForm(emptyFacility);
    setServiceInput('');
  };

  const openFacilityModal = (facility?: EducationHealthFacilityData) => {
    if (facility) {
      setEditingFacility(facility);
      setFacilityForm(facility);
    } else {
      resetFacilityForm();
    }
    setFacilityModalOpen(true);
  };

  const handleFacilitySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const method = editingFacility ? 'PUT' : 'POST';
      const body = editingFacility
        ? { type: 'facility', payload: { ...facilityForm, id: editingFacility.id } }
        : { type: 'facility', payload: facilityForm };

      const response = await fetch('/api/education-health', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to save facility');
      }

      toast.success(editingFacility ? 'सुविधा अपडेट केली' : 'नवीन सुविधा जोडली');
      setFacilityModalOpen(false);
      resetFacilityForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('सुविधा जतन करताना त्रुटी आली');
    }
  };

  const handleFacilityDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही सुविधा हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/education-health?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete facility');
      }
      toast.success('सुविधा हटवली');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('सुविधा हटवताना त्रुटी आली');
    }
  };

  const handleFacilityToggle = async (facility: EducationHealthFacilityData) => {
    if (!facility.id) return;
    try {
      const response = await fetch('/api/education-health', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'facility',
          payload: { ...facility, id: facility.id, isActive: !facility.isActive }
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update facility');
      }
      toast.success(facility.isActive ? 'निष्क्रिय केले' : 'सक्रिय केले');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('स्थिती अपडेट करताना त्रुटी');
    }
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setFacilityForm((prev) => ({
        ...prev,
        services: [...(prev.services || []), serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const removeService = (index: number) => {
    setFacilityForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'school':
        return School;
      case 'anganwadi':
        return Baby;
      case 'health_center':
        return Heart;
      case 'hospital':
        return Stethoscope;
      default:
        return Users;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'school':
        return 'शाळा';
      case 'anganwadi':
        return 'अंगणवाडी';
      case 'health_center':
        return 'आरोग्य केंद्र';
      case 'hospital':
        return 'रुग्णालय';
      default:
        return 'इतर';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">शाळा, अंगणवाडी, आरोग्य केंद्रे</h1>
        <p className="text-gray-600 mt-2">
          गावातील शैक्षणिक आणि आरोग्य सुविधा याबद्दल अद्ययावत माहिती द्या.
        </p>
        {isDemo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              सध्या तुम्ही डेमो डेटा पाहत आहात. माहिती जतन केल्यावर हे विभाग तुमच्या गावाच्या वास्तविक
              माहितीने भरले जाईल.
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>मुख्य माहिती</CardTitle>
          <CardDescription>शिक्षण आणि आरोग्याची प्रमुख आकडेवारी अपडेट करा.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSnapshotSubmit}>
            {/* Section Titles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">विभाग शीर्षक</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>विभाग शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.sectionTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectionTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>विभाग शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.sectionTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectionTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>उपशीर्षक (मराठी)</Label>
                <Textarea
                  value={snapshotForm.sectionSubtitle}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label>उपशीर्षक (English)</Label>
                <Textarea
                  value={snapshotForm.sectionSubtitleEn}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectionSubtitleEn: e.target.value }))}
                  rows={2}
                  required
                />
              </div>
            </div>

            {/* Education Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">शिक्षण माहिती</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>शिक्षण माहिती शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.educationInfoTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, educationInfoTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>शिक्षण माहिती शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.educationInfoTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, educationInfoTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label>एकूण शाळा</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationTotalSchools}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationTotalSchools: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>प्राथमिक शाळा</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationPrimarySchools}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationPrimarySchools: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>माध्यमिक शाळा</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationSecondarySchools}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationSecondarySchools: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>अंगणवाडी</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationAnganwadis}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationAnganwadis: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>एकूण विद्यार्थी</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationTotalStudents}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationTotalStudents: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>एकूण शिक्षक</Label>
                  <Input
                    type="number"
                    value={snapshotForm.educationTotalTeachers}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationTotalTeachers: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>साक्षरता दर (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={snapshotForm.educationLiteracyRate}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, educationLiteracyRate: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label>अद्यतन तारीख</Label>
                <Input
                  value={snapshotForm.educationLastCensus}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, educationLastCensus: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">आरोग्य माहिती</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>आरोग्य माहिती शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.healthInfoTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, healthInfoTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>आरोग्य माहिती शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.healthInfoTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, healthInfoTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label>एकूण केंद्रे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthTotalCenters}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthTotalCenters: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>प्राथमिक आरोग्य केंद्रे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthPrimaryHealthCenters}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthPrimaryHealthCenters: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>उप-केंद्रे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthSubCenters}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthSubCenters: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>अंगणवाडी केंद्रे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthAnganwadiCenters}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthAnganwadiCenters: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>एकूण डॉक्टर</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthTotalDoctors}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthTotalDoctors: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>एकूण नर्स</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthTotalNurses}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthTotalNurses: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>एकूण बेड</Label>
                  <Input
                    type="number"
                    value={snapshotForm.healthTotalBeds}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, healthTotalBeds: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label>अद्यतन तारीख</Label>
                <Input
                  value={snapshotForm.healthLastInspection}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, healthLastInspection: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Issue Contact Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">समस्या संपर्क विभाग</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>समस्या शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.issueTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>समस्या शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.issueTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>समस्या वर्णन (मराठी)</Label>
                <Textarea
                  value={snapshotForm.issueDescription}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueDescription: e.target.value }))}
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label>समस्या वर्णन (English)</Label>
                <Textarea
                  value={snapshotForm.issueDescriptionEn}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueDescriptionEn: e.target.value }))}
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>संपर्क लेबल (मराठी)</Label>
                  <Input
                    value={snapshotForm.issueContactLabel}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueContactLabel: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>संपर्क लेबल (English)</Label>
                  <Input
                    value={snapshotForm.issueContactLabelEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueContactLabelEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>संपर्क क्रमांक</Label>
                <Input
                  value={snapshotForm.issueContactNumber}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueContactNumber: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>पहिले क्रिया बटण लेबल (मराठी)</Label>
                  <Input
                    value={snapshotForm.issueActionLabel1}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel1: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>पहिले क्रिया बटण लेबल (English)</Label>
                  <Input
                    value={snapshotForm.issueActionLabel1En}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel1En: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>दुसरे क्रिया बटण लेबल (मराठी) - वैकल्पिक</Label>
                  <Input
                    value={snapshotForm.issueActionLabel2 || ''}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel2: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>दुसरे क्रिया बटण लेबल (English) - वैकल्पिक</Label>
                  <Input
                    value={snapshotForm.issueActionLabel2En || ''}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel2En: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={savingSnapshot}>
                {savingSnapshot ? 'जतन होत आहे...' : 'माहिती जतन करा'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">सुविधा कार्ड्स</h2>
          <p className="text-gray-600">शाळा, अंगणवाडी, आरोग्य केंद्रे आणि रुग्णालयांची माहिती व्यवस्थापित करा.</p>
        </div>
        <Button onClick={() => openFacilityModal()}>
          <Plus className="h-4 w-4 mr-2" />
          नवीन सुविधा
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {facilities.map((facility) => {
          const TypeIcon = getTypeIcon(facility.type);
          return (
            <Card key={facility.id || facility.title} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{facility.title}</CardTitle>
                    <CardDescription>{facility.titleEn}</CardDescription>
                  </div>
                  <Badge variant={facility.isActive ? 'default' : 'secondary'}>
                    {facility.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <TypeIcon className="h-4 w-4 text-blue-500 mr-2" />
                  {getTypeLabel(facility.type)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Badge variant="outline">{facility.status}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-red-500 mr-2" />
                  {facility.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 text-purple-500 mr-2" />
                  क्षमता: {facility.capacity}, कर्मचारी: {facility.staff}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-teal-500 mr-2" />
                  {facility.contactNumber}
                </div>
                {facility.services && facility.services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {facility.services.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {facility.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{facility.services.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => openFacilityModal(facility)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    संपादित
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFacilityToggle(facility)}
                    className={facility.isActive ? 'text-yellow-600' : 'text-green-600'}
                  >
                    {facility.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFacilityDelete(facility.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {facilityModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {editingFacility ? 'सुविधा संपादित करा' : 'नवीन सुविधा जोडा'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    शाळा, अंगणवाडी, आरोग्य केंद्र किंवा रुग्णालयसाठी सर्व माहिती भरा.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setFacilityModalOpen(false)}>
                  बंद करा
                </Button>
              </div>

              <form className="space-y-6" onSubmit={handleFacilitySubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={facilityForm.title}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={facilityForm.titleEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकार</Label>
                    <select
                      value={facilityForm.type}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="school">शाळा</option>
                      <option value="anganwadi">अंगणवाडी</option>
                      <option value="health_center">आरोग्य केंद्र</option>
                      <option value="hospital">रुग्णालय</option>
                    </select>
                  </div>
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={facilityForm.status}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, status: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={facilityForm.statusEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, statusEn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थळ (मराठी)</Label>
                    <Input
                      value={facilityForm.location}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थळ (English)</Label>
                    <Input
                      value={facilityForm.locationEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, locationEn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्षमता</Label>
                    <Input
                      value={facilityForm.capacity}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, capacity: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कर्मचारी संख्या</Label>
                    <Input
                      type="number"
                      value={facilityForm.staff}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, staff: Number(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>अद्यतन तारीख</Label>
                    <Input
                      value={facilityForm.lastInspection}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, lastInspection: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>सेवा</Label>
                  <div className="space-y-2">
                    {facilityForm.services?.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={service} readOnly />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        placeholder="नवीन सेवा जोडा"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addService();
                          }
                        }}
                      />
                      <Button type="button" onClick={addService}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>संपर्क क्रमांक</Label>
                    <Input
                      value={facilityForm.contactNumber}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={facilityForm.order}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-8">
                    <input
                      type="checkbox"
                      checked={facilityForm.isActive}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFacilityModalOpen(false);
                      resetFacilityForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingFacility ? 'अपडेट करा' : 'जोडा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

