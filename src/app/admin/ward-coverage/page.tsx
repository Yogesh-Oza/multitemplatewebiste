'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, MapPin, X, Check, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  wardCoverageDemoData,
  WardCoverageDataData,
  WardScheme
} from '@/lib/demo-schemes-beneficiary';

const emptyWard: WardCoverageDataData = {
  wardNumber: '',
  wardName: '',
  wardNameEn: '',
  totalHouseholds: 0,
  beneficiaries: 0,
  coveragePercentage: 0,
  schemes: [],
  lastUpdated: '',
  order: 0,
  isActive: true
};

const emptyScheme: WardScheme = {
  name: '',
  nameEn: '',
  beneficiaries: 0,
  color: 'bg-blue-500'
};

export default function WardCoverageAdminPage() {
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<WardCoverageDataData[]>(wardCoverageDemoData);
  const [isDemo, setIsDemo] = useState(true);
  const [wardModalOpen, setWardModalOpen] = useState(false);
  const [wardForm, setWardForm] = useState<WardCoverageDataData>(emptyWard);
  const [editingWard, setEditingWard] = useState<WardCoverageDataData | null>(null);
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [schemeForm, setSchemeForm] = useState<WardScheme>(emptyScheme);
  const [editingSchemeIndex, setEditingSchemeIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ward-coverage');
      if (response.ok) {
        const data = await response.json();
        setWards(
          (data.wards?.length ? data.wards : wardCoverageDemoData).sort(
            (a: WardCoverageDataData, b: WardCoverageDataData) => (a.order ?? 0) - (b.order ?? 0)
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

  const resetWardForm = () => {
    setEditingWard(null);
    setWardForm(emptyWard);
  };

  const openWardModal = (ward?: WardCoverageDataData) => {
    if (ward) {
      setEditingWard(ward);
      setWardForm(ward);
    } else {
      resetWardForm();
    }
    setWardModalOpen(true);
  };

  const handleWardSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Auto-calculate coverage percentage
      const coveragePercentage = wardForm.totalHouseholds > 0
        ? Math.round((wardForm.beneficiaries / wardForm.totalHouseholds) * 100)
        : 0;

      const method = editingWard ? 'PUT' : 'POST';
      const body = editingWard
        ? { ...wardForm, id: editingWard.id, coveragePercentage }
        : { ...wardForm, coveragePercentage };

      const response = await fetch('/api/ward-coverage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to save ward');
      }

      toast.success(editingWard ? 'वॉर्ड अपडेट केला' : 'नवीन वॉर्ड जोडला');
      setWardModalOpen(false);
      resetWardForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('वॉर्ड जतन करताना त्रुटी आली');
    }
  };

  const handleWardDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हा वॉर्ड हटवायचा आहे?')) return;

    try {
      const response = await fetch(`/api/ward-coverage?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete ward');
      }
      toast.success('वॉर्ड हटवला');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('वॉर्ड हटवताना त्रुटी आली');
    }
  };

  const handleWardToggle = async (ward: WardCoverageDataData) => {
    if (!ward.id) return;
    try {
      const response = await fetch('/api/ward-coverage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ward,
          id: ward.id,
          isActive: !ward.isActive
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update ward');
      }
      toast.success(ward.isActive ? 'निष्क्रिय केले' : 'सक्रिय केले');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('स्थिती अपडेट करताना त्रुटी');
    }
  };

  const openSchemeModal = (scheme?: WardScheme, index?: number) => {
    if (scheme && index !== undefined) {
      setEditingSchemeIndex(index);
      setSchemeForm(scheme);
    } else {
      setEditingSchemeIndex(null);
      setSchemeForm(emptyScheme);
    }
    setSchemeModalOpen(true);
  };

  const handleSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchemes = [...(wardForm.schemes || [])];
    if (editingSchemeIndex !== null) {
      newSchemes[editingSchemeIndex] = schemeForm;
    } else {
      newSchemes.push(schemeForm);
    }
    setWardForm({ ...wardForm, schemes: newSchemes });
    setSchemeModalOpen(false);
    setEditingSchemeIndex(null);
    setSchemeForm(emptyScheme);
  };

  const handleSchemeDelete = (index: number) => {
    if (!confirm('ही योजना हटवायची आहे?')) return;
    const newSchemes = wardForm.schemes.filter((_, i) => i !== index);
    setWardForm({ ...wardForm, schemes: newSchemes });
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' }
  ];

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Auto-calculate coverage when households or beneficiaries change
  const updateCoverage = (households: number, beneficiaries: number) => {
    const percentage = households > 0 ? Math.round((beneficiaries / households) * 100) : 0;
    setWardForm((prev) => ({ ...prev, totalHouseholds: households, beneficiaries, coveragePercentage: percentage }));
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
        <h1 className="text-3xl font-bold text-gray-900">वॉर्ड कव्हरेज नकाशा</h1>
        <p className="text-gray-600 mt-2">
          प्रत्येक वॉर्डनिहाय लाभ घेतलेल्या घरांची माहिती व्यवस्थापित करा.
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">सर्व वॉर्ड</h2>
          <p className="text-gray-600">वॉर्डनिहाय कव्हरेज माहिती जोडा, संपादित करा किंवा हटवा.</p>
        </div>
        <Button onClick={() => openWardModal()}>
          <Plus className="h-4 w-4 mr-2" />
          नवीन वॉर्ड
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {wards.map((ward) => (
          <Card key={ward.id || ward.wardNumber} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{ward.wardName}</CardTitle>
                  <CardDescription>{ward.wardNameEn}</CardDescription>
                </div>
                <Badge variant={ward.isActive ? 'default' : 'secondary'}>
                  {ward.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{ward.totalHouseholds}</div>
                  <div className="text-sm text-gray-600">एकूण घरं</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{ward.beneficiaries}</div>
                  <div className="text-sm text-gray-600">लाभार्थी</div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">कव्हरेज</span>
                  <Badge className={getCoverageColor(ward.coveragePercentage)}>
                    {ward.coveragePercentage}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      ward.coveragePercentage >= 80 ? 'bg-green-500' :
                      ward.coveragePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${ward.coveragePercentage}%` }}
                  />
                </div>
              </div>
              {ward.schemes && ward.schemes.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-semibold">योजना:</div>
                  {ward.schemes.slice(0, 3).map((scheme, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full ${scheme.color}`} />
                      <span>{scheme.name}: {scheme.beneficiaries}</span>
                    </div>
                  ))}
                  {ward.schemes.length > 3 && (
                    <div className="text-xs text-gray-500">+{ward.schemes.length - 3} अधिक</div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => openWardModal(ward)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  संपादित
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWardToggle(ward)}
                  className={ward.isActive ? 'text-yellow-600' : 'text-green-600'}
                >
                  {ward.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleWardDelete(ward.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wardModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {editingWard ? 'वॉर्ड संपादित करा' : 'नवीन वॉर्ड जोडा'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    वॉर्डनिहाय कव्हरेज माहिती भरा.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setWardModalOpen(false)}>
                  बंद करा
                </Button>
              </div>

              <form className="space-y-6" onSubmit={handleWardSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>वॉर्ड क्रमांक</Label>
                    <Input
                      value={wardForm.wardNumber}
                      onChange={(e) => setWardForm((prev) => ({ ...prev, wardNumber: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>वॉर्ड नाव (मराठी)</Label>
                    <Input
                      value={wardForm.wardName}
                      onChange={(e) => setWardForm((prev) => ({ ...prev, wardName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>वॉर्ड नाव (English)</Label>
                    <Input
                      value={wardForm.wardNameEn}
                      onChange={(e) => setWardForm((prev) => ({ ...prev, wardNameEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>एकूण घरं</Label>
                    <Input
                      type="number"
                      value={wardForm.totalHouseholds}
                      onChange={(e) => updateCoverage(Number(e.target.value) || 0, wardForm.beneficiaries)}
                      required
                    />
                  </div>
                  <div>
                    <Label>लाभार्थी</Label>
                    <Input
                      type="number"
                      value={wardForm.beneficiaries}
                      onChange={(e) => updateCoverage(wardForm.totalHouseholds, Number(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <Label>कव्हरेज (%)</Label>
                    <Input
                      type="number"
                      value={wardForm.coveragePercentage}
                      readOnly
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">स्वयंचलितपणे गणना केली जाते</p>
                  </div>
                </div>

                <div>
                  <Label>अद्यतन तारीख</Label>
                  <Input
                    value={wardForm.lastUpdated}
                    onChange={(e) => setWardForm((prev) => ({ ...prev, lastUpdated: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>योजना</Label>
                    <Button type="button" onClick={() => openSchemeModal()}>
                      <Plus className="h-4 w-4 mr-2" />
                      योजना जोडा
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {wardForm.schemes?.map((scheme, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                        <div className="flex-1">
                          <div className="font-semibold">{scheme.name}</div>
                          <div className="text-sm text-gray-600">{scheme.beneficiaries} लाभार्थी</div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openSchemeModal(scheme, index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSchemeDelete(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!wardForm.schemes || wardForm.schemes.length === 0) && (
                      <p className="text-center text-gray-500 py-4">कोणतीही योजना नाही. योजना जोडा.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={wardForm.order}
                      onChange={(e) => setWardForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-8">
                    <input
                      type="checkbox"
                      checked={wardForm.isActive}
                      onChange={(e) => setWardForm((prev) => ({ ...prev, isActive: e.target.checked }))}
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
                      setWardModalOpen(false);
                      resetWardForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingWard ? 'अपडेट करा' : 'जोडा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Modal */}
      {schemeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingSchemeIndex !== null ? 'योजना संपादित करा' : 'नवीन योजना जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setSchemeModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSchemeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={schemeForm.name}
                      onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={schemeForm.nameEn}
                      onChange={(e) => setSchemeForm({ ...schemeForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>लाभार्थी</Label>
                    <Input
                      type="number"
                      value={schemeForm.beneficiaries}
                      onChange={(e) => setSchemeForm({ ...schemeForm, beneficiaries: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>रंग</Label>
                    <select
                      value={schemeForm.color}
                      onChange={(e) => setSchemeForm({ ...schemeForm, color: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setSchemeModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

