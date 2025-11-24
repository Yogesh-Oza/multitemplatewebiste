'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Navigation, Lightbulb, Phone, MapPin, Check, X, Car, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  roadsLightingDemoSnapshot,
  roadsLightingDemoFacilities,
  RoadsLightingSnapshotData,
  RoadsLightingFacilityData
} from '@/lib/demo-roads-lighting';

const emptyFacility: RoadsLightingFacilityData = {
  title: '',
  titleEn: '',
  type: 'road',
  status: 'operational',
  statusEn: 'Operational',
  location: '',
  locationEn: '',
  length: '',
  capacity: '',
  lastMaintenance: '',
  contactNumber: '',
  contactLabel: 'संपर्क माहिती',
  contactLabelEn: 'Contact Information',
  actionLabel: 'कॉल करा',
  actionLabelEn: 'Call Now',
  order: 0,
  isActive: true
};

export default function RoadsLightingAdminPage() {
  const [loading, setLoading] = useState(true);
  const [snapshotForm, setSnapshotForm] = useState<RoadsLightingSnapshotData>(roadsLightingDemoSnapshot);
  const [facilities, setFacilities] = useState<RoadsLightingFacilityData[]>(roadsLightingDemoFacilities);
  const [isDemo, setIsDemo] = useState(true);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [facilityForm, setFacilityForm] = useState<RoadsLightingFacilityData>(emptyFacility);
  const [editingFacility, setEditingFacility] = useState<RoadsLightingFacilityData | null>(null);
  const [upcomingWorkInput, setUpcomingWorkInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roads-lighting');
      if (response.ok) {
        const data = await response.json();
        setSnapshotForm(data.snapshot || roadsLightingDemoSnapshot);
        setFacilities(
          (data.facilities?.length ? data.facilities : roadsLightingDemoFacilities).sort(
            (a: RoadsLightingFacilityData, b: RoadsLightingFacilityData) => (a.order ?? 0) - (b.order ?? 0)
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
      const response = await fetch('/api/roads-lighting', {
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
  };

  const openFacilityModal = (facility?: RoadsLightingFacilityData) => {
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

      const response = await fetch('/api/roads-lighting', {
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
      const response = await fetch(`/api/roads-lighting?id=${id}`, { method: 'DELETE' });
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

  const handleFacilityToggle = async (facility: RoadsLightingFacilityData) => {
    if (!facility.id) return;
    try {
      const response = await fetch('/api/roads-lighting', {
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

  const addUpcomingWork = () => {
    if (upcomingWorkInput.trim()) {
      setSnapshotForm((prev) => ({
        ...prev,
        roadsUpcomingWork: [...(prev.roadsUpcomingWork || []), upcomingWorkInput.trim()]
      }));
      setUpcomingWorkInput('');
    }
  };

  const removeUpcomingWork = (index: number) => {
    setSnapshotForm((prev) => ({
      ...prev,
      roadsUpcomingWork: prev.roadsUpcomingWork.filter((_, i) => i !== index)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'road':
        return Navigation;
      case 'bridge':
        return BarChart3;
      case 'streetlight':
        return Lightbulb;
      case 'traffic':
        return Car;
      default:
        return Navigation;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'road':
        return 'रस्ता';
      case 'bridge':
        return 'पुल';
      case 'streetlight':
        return 'स्ट्रीट लाइट';
      case 'traffic':
        return 'ट्रॅफिक';
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
        <h1 className="text-3xl font-bold text-gray-900">रस्ते आणि रस्त्यावरील दिवे</h1>
        <p className="text-gray-600 mt-2">
          गावातील रस्ते, पुल, स्ट्रीट लाइट्स आणि वाहतूक व्यवस्था याबद्दल अद्ययावत माहिती द्या.
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
          <CardDescription>रस्ते आणि स्ट्रीट लाइटिंगची प्रमुख आकडेवारी अपडेट करा.</CardDescription>
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

            {/* Roads Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">रस्ते माहिती</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>रस्ते माहिती शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.roadsInfoTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, roadsInfoTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>रस्ते माहिती शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.roadsInfoTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, roadsInfoTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>एकूण रस्ते लांबी (किमी)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={snapshotForm.roadsTotalLength}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, roadsTotalLength: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>पक्के रस्ते (किमी)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={snapshotForm.roadsPavedLength}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, roadsPavedLength: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>कच्चे रस्ते (किमी)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={snapshotForm.roadsUnpavedLength}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, roadsUnpavedLength: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>रस्त्यांची स्थिती (मराठी)</Label>
                  <Input
                    value={snapshotForm.roadsCondition}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, roadsCondition: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>रस्त्यांची स्थिती (English)</Label>
                  <Input
                    value={snapshotForm.roadsConditionEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, roadsConditionEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>अद्यतन तारीख</Label>
                <Input
                  value={snapshotForm.roadsLastMaintenance}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, roadsLastMaintenance: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>आगामी कामे</Label>
                <div className="space-y-2">
                  {snapshotForm.roadsUpcomingWork?.map((work, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={work} readOnly />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeUpcomingWork(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={upcomingWorkInput}
                      onChange={(e) => setUpcomingWorkInput(e.target.value)}
                      placeholder="नवीन काम जोडा"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addUpcomingWork();
                        }
                      }}
                    />
                    <Button type="button" onClick={addUpcomingWork}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Street Lighting Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">स्ट्रीट लाइटिंग माहिती</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>लाइटिंग माहिती शीर्षक (मराठी)</Label>
                  <Input
                    value={snapshotForm.lightingInfoTitle}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingInfoTitle: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>लाइटिंग माहिती शीर्षक (English)</Label>
                  <Input
                    value={snapshotForm.lightingInfoTitleEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingInfoTitleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label>एकूण दिवे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.lightingTotalLights}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, lightingTotalLights: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>कार्यरत दिवे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.lightingFunctionalLights}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, lightingFunctionalLights: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>LED दिवे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.lightingLedLights}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, lightingLedLights: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>पारंपरिक दिवे</Label>
                  <Input
                    type="number"
                    value={snapshotForm.lightingTraditionalLights}
                    onChange={(e) =>
                      setSnapshotForm((prev) => ({ ...prev, lightingTraditionalLights: Number(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>कार्य तास</Label>
                  <Input
                    value={snapshotForm.lightingWorkingHours}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingWorkingHours: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>अद्यतन तारीख</Label>
                  <Input
                    value={snapshotForm.lightingLastMaintenance}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingLastMaintenance: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>ऊर्जा स्रोत (मराठी)</Label>
                  <Input
                    value={snapshotForm.lightingEnergySource}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingEnergySource: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>ऊर्जा स्रोत (English)</Label>
                <Input
                  value={snapshotForm.lightingEnergySourceEn}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, lightingEnergySourceEn: e.target.value }))}
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
                  <Label>क्रिया बटण लेबल (मराठी)</Label>
                  <Input
                    value={snapshotForm.issueActionLabel}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>क्रिया बटण लेबल (English)</Label>
                  <Input
                    value={snapshotForm.issueActionLabelEn}
                    onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabelEn: e.target.value }))}
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
          <p className="text-gray-600">रस्ते, पुल, स्ट्रीट लाइट्स आणि ट्रॅफिक सिग्नलची माहिती व्यवस्थापित करा.</p>
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
                {facility.length && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
                    लांबी: {facility.length}
                  </div>
                )}
                {facility.capacity && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                    क्षमता: {facility.capacity}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-teal-500 mr-2" />
                  {facility.contactNumber}
                </div>
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
                    रस्ते, पुल, स्ट्रीट लाइट्स किंवा ट्रॅफिक सिग्नलसाठी सर्व माहिती भरा.
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
                      <option value="road">रस्ता</option>
                      <option value="bridge">पुल</option>
                      <option value="streetlight">स्ट्रीट लाइट</option>
                      <option value="traffic">ट्रॅफिक सिग्नल</option>
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
                    <Label>लांबी (रस्त्यासाठी) - वैकल्पिक</Label>
                    <Input
                      value={facilityForm.length || ''}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>क्षमता (पुल/लाइट्ससाठी) - वैकल्पिक</Label>
                    <Input
                      value={facilityForm.capacity || ''}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, capacity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>अद्यतन तारीख</Label>
                    <Input
                      value={facilityForm.lastMaintenance}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, lastMaintenance: e.target.value }))}
                      required
                    />
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

