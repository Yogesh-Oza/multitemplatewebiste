'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Droplets, ShieldCheck, Recycle, Phone, MapPin, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  waterSanitationDemoSnapshot,
  waterSanitationDemoFacilities,
  WaterSanitationSnapshotData,
  WaterSanitationFacilityData
} from '@/lib/demo-water-sanitation';

const emptyFacility: WaterSanitationFacilityData = {
  title: '',
  titleEn: '',
  category: '',
  status: '',
  statusEn: '',
  location: '',
  locationEn: '',
  capacity: '',
  capacityEn: '',
  updatedOn: '',
  contactNumber: '',
  contactLabel: 'संपर्क माहिती',
  contactLabelEn: 'Contact Information',
  actionLabel: 'कॉल करा',
  actionLabelEn: 'Call Now',
  order: 0,
  isActive: true
};

export default function WaterSanitationAdminPage() {
  const [loading, setLoading] = useState(true);
  const [snapshotForm, setSnapshotForm] = useState<WaterSanitationSnapshotData>(waterSanitationDemoSnapshot);
  const [facilities, setFacilities] = useState<WaterSanitationFacilityData[]>(waterSanitationDemoFacilities);
  const [isDemo, setIsDemo] = useState(true);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [facilityForm, setFacilityForm] = useState<WaterSanitationFacilityData>(emptyFacility);
  const [editingFacility, setEditingFacility] = useState<WaterSanitationFacilityData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/water-sanitation');
      if (response.ok) {
        const data = await response.json();
        setSnapshotForm(data.snapshot || waterSanitationDemoSnapshot);
        setFacilities(
          (data.facilities?.length ? data.facilities : waterSanitationDemoFacilities).sort(
            (a: WaterSanitationFacilityData, b: WaterSanitationFacilityData) => (a.order ?? 0) - (b.order ?? 0)
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
      const response = await fetch('/api/water-sanitation', {
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

  const openFacilityModal = (facility?: WaterSanitationFacilityData) => {
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

      const response = await fetch('/api/water-sanitation', {
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
      const response = await fetch(`/api/water-sanitation?id=${id}`, { method: 'DELETE' });
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

  const handleFacilityToggle = async (facility: WaterSanitationFacilityData) => {
    if (!facility.id) return;
    try {
      const response = await fetch('/api/water-sanitation', {
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
        <h1 className="text-3xl font-bold text-gray-900">पाणीपुरवठा आणि स्वच्छता</h1>
        <p className="text-gray-600 mt-2">
          गावातील पाणीपुरवठा, स्वच्छता सुविधा आणि कचरा व्यवस्थापन याबद्दल अद्ययावत माहिती द्या.
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
          <CardDescription>पाणीपुरवठा आणि स्वच्छतेची प्रमुख आकडेवारी अपडेट करा.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSnapshotSubmit}>
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
              <Label>उपशीर्षक</Label>
              <Textarea
                value={snapshotForm.sectionSubtitle}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>कार्यरत कनेक्शन</Label>
                <Input
                  type="number"
                  value={snapshotForm.waterConnectionsActive}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, waterConnectionsActive: Number(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div>
                <Label>एकूण कनेक्शन</Label>
                <Input
                  type="number"
                  value={snapshotForm.waterConnectionsTotal}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, waterConnectionsTotal: Number(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div>
                <Label>पाणी गुणवत्ता स्थिती</Label>
                <Input
                  value={snapshotForm.waterQualityStatus}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, waterQualityStatus: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>दैनिक पुरवठा</Label>
                <Input
                  value={snapshotForm.waterSupplyDuration}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, waterSupplyDuration: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>पुरवठा उपशीर्षक</Label>
                <Input
                  value={snapshotForm.waterSupplyFrequency}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, waterSupplyFrequency: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>साठवण क्षमता (लिटर)</Label>
                <Input
                  value={snapshotForm.waterStorageCapacityValue}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, waterStorageCapacityValue: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>कार्यरत शौचालये</Label>
                <Input
                  type="number"
                  value={snapshotForm.sanitationFunctionalToilets}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, sanitationFunctionalToilets: Number(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div>
                <Label>एकूण शौचालये</Label>
                <Input
                  type="number"
                  value={snapshotForm.sanitationTotalToilets}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, sanitationTotalToilets: Number(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div>
                <Label>सार्वजनिक शौचालये</Label>
                <Input
                  type="number"
                  value={snapshotForm.sanitationPublicToilets}
                  onChange={(e) =>
                    setSnapshotForm((prev) => ({ ...prev, sanitationPublicToilets: Number(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>कचरा संकलन स्थिती</Label>
                <Input
                  value={snapshotForm.wasteCollectionStatus}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, wasteCollectionStatus: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>निकासी स्थिती</Label>
                <Input
                  value={snapshotForm.drainageStatus}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, drainageStatus: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label>समस्या विभाग वर्णन</Label>
              <Textarea
                rows={3}
                value={snapshotForm.issueDescription}
                onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueDescription: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>संपर्क क्रमांक</Label>
                <Input
                  value={snapshotForm.issueContactNumber}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueContactNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>बटण मजकूर</Label>
                <Input
                  value={snapshotForm.issueActionLabel}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, issueActionLabel: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Emergency Title</Label>
                <Input
                  value={snapshotForm.emergencyTitle}
                  onChange={(e) => setSnapshotForm((prev) => ({ ...prev, emergencyTitle: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
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
          <p className="text-gray-600">पाणी टाकी, शोधन केंद्र, कचरा केंद्र इत्यादीची माहिती व्यवस्थापित करा.</p>
        </div>
        <Button onClick={() => openFacilityModal()}>
          <Plus className="h-4 w-4 mr-2" />
          नवीन सुविधा
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {facilities.map((facility) => (
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
                <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                {facility.category}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                {facility.status}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                {facility.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Recycle className="h-4 w-4 text-purple-500 mr-2" />
                {facility.capacity}
              </div>
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
        ))}
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
                    पाणी व स्वच्छता संबंधित सुविधा कार्डसाठी सर्व माहिती भरा.
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
                    <Label>स्थिती</Label>
                    <Input
                      value={facilityForm.status}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, status: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={facilityForm.statusEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, statusEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थळ</Label>
                    <Input
                      value={facilityForm.location}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थळ (English)</Label>
                    <Input
                      value={facilityForm.locationEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, locationEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>क्षमता</Label>
                    <Input
                      value={facilityForm.capacity}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, capacity: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्षमता (English)</Label>
                    <Input
                      value={facilityForm.capacityEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, capacityEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कॅटेगरी</Label>
                    <Input
                      value={facilityForm.category}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>अद्यतन तारीख</Label>
                    <Input
                      value={facilityForm.updatedOn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, updatedOn: e.target.value }))}
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

