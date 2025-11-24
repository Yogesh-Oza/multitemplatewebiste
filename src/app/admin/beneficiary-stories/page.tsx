'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Star, X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  beneficiaryStoriesDemoData,
  BeneficiaryStoryData
} from '@/lib/demo-schemes-beneficiary';

const emptyStory: BeneficiaryStoryData = {
  name: '',
  nameEn: '',
  age: 0,
  scheme: '',
  schemeEn: '',
  story: '',
  storyEn: '',
  impact: '',
  impactEn: '',
  beforeImage: '',
  afterImage: '',
  location: '',
  locationEn: '',
  date: '',
  benefits: [],
  rating: 5,
  isStar: false,
  order: 0,
  isActive: true
};

export default function BeneficiaryStoriesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<BeneficiaryStoryData[]>(beneficiaryStoriesDemoData);
  const [isDemo, setIsDemo] = useState(true);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyForm, setStoryForm] = useState<BeneficiaryStoryData>(emptyStory);
  const [editingStory, setEditingStory] = useState<BeneficiaryStoryData | null>(null);
  const [benefitInput, setBenefitInput] = useState('');
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/beneficiary-stories');
      if (response.ok) {
        const data = await response.json();
        setStories(
          (data.stories?.length ? data.stories : beneficiaryStoriesDemoData).sort(
            (a: BeneficiaryStoryData, b: BeneficiaryStoryData) => (a.order ?? 0) - (b.order ?? 0)
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

  const resetStoryForm = () => {
    setEditingStory(null);
    setStoryForm(emptyStory);
    setBenefitInput('');
  };

  const openStoryModal = (story?: BeneficiaryStoryData) => {
    if (story) {
      setEditingStory(story);
      setStoryForm(story);
    } else {
      resetStoryForm();
    }
    setStoryModalOpen(true);
  };

  const handleStorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const method = editingStory ? 'PUT' : 'POST';
      const body = editingStory
        ? { ...storyForm, id: editingStory.id }
        : storyForm;

      const response = await fetch('/api/beneficiary-stories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to save story');
      }

      toast.success(editingStory ? 'कथा अपडेट केली' : 'नवीन कथा जोडली');
      setStoryModalOpen(false);
      resetStoryForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('कथा जतन करताना त्रुटी आली');
    }
  };

  const handleStoryDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही कथा हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/beneficiary-stories?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete story');
      }
      toast.success('कथा हटवली');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('कथा हटवताना त्रुटी आली');
    }
  };

  const handleStoryToggle = async (story: BeneficiaryStoryData) => {
    if (!story.id) return;
    try {
      const response = await fetch('/api/beneficiary-stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...story,
          id: story.id,
          isActive: !story.isActive
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update story');
      }
      toast.success(story.isActive ? 'निष्क्रिय केले' : 'सक्रिय केले');
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('स्थिती अपडेट करताना त्रुटी');
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setStoryForm((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setStoryForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'before') {
        setIsUploadingBefore(true);
      } else {
        setIsUploadingAfter(true);
      }

      toast.loading('प्रतिमा अपलोड होत आहे...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (type === 'before') {
          setStoryForm((prev) => ({ ...prev, beforeImage: result.imageUrl }));
        } else {
          setStoryForm((prev) => ({ ...prev, afterImage: result.imageUrl }));
        }
        toast.success('प्रतिमा अपलोड केली');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    } finally {
      setIsUploadingBefore(false);
      setIsUploadingAfter(false);
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
        <h1 className="text-3xl font-bold text-gray-900">लाभार्थी कथा</h1>
        <p className="text-gray-600 mt-2">
          योजनांच्या माध्यमातून जीवन बदलणाऱ्या लाभार्थ्यांच्या कथा व्यवस्थापित करा.
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
          <h2 className="text-2xl font-semibold">सर्व कथा</h2>
          <p className="text-gray-600">लाभार्थ्यांच्या प्रेरणादायी कथा जोडा, संपादित करा किंवा हटवा.</p>
        </div>
        <Button onClick={() => openStoryModal()}>
          <Plus className="h-4 w-4 mr-2" />
          नवीन कथा
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id || story.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{story.name}</CardTitle>
                  <CardDescription>{story.nameEn}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {story.isStar && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      स्टार
                    </Badge>
                  )}
                  <Badge variant={story.isActive ? 'default' : 'secondary'}>
                    {story.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>वय: {story.age} वर्षे</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>योजना: {story.scheme}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>स्थान: {story.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>तारीख: {story.date}</span>
              </div>
              {story.benefits && story.benefits.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {story.benefits.slice(0, 3).map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                  {story.benefits.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{story.benefits.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => openStoryModal(story)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  संपादित
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStoryToggle(story)}
                  className={story.isActive ? 'text-yellow-600' : 'text-green-600'}
                >
                  {story.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleStoryDelete(story.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {storyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {editingStory ? 'कथा संपादित करा' : 'नवीन कथा जोडा'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    लाभार्थ्यांच्या प्रेरणादायी कथेसाठी सर्व माहिती भरा.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setStoryModalOpen(false)}>
                  बंद करा
                </Button>
              </div>

              <form className="space-y-6" onSubmit={handleStorySubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={storyForm.name}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={storyForm.nameEn}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>वय</Label>
                    <Input
                      type="number"
                      value={storyForm.age}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, age: Number(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>योजना (मराठी)</Label>
                    <Input
                      value={storyForm.scheme}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, scheme: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>योजना (English)</Label>
                    <Input
                      value={storyForm.schemeEn}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, schemeEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>कथा (मराठी)</Label>
                  <Textarea
                    value={storyForm.story}
                    onChange={(e) => setStoryForm((prev) => ({ ...prev, story: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label>कथा (English)</Label>
                  <Textarea
                    value={storyForm.storyEn}
                    onChange={(e) => setStoryForm((prev) => ({ ...prev, storyEn: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label>परिणाम (मराठी)</Label>
                  <Textarea
                    value={storyForm.impact}
                    onChange={(e) => setStoryForm((prev) => ({ ...prev, impact: e.target.value }))}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>परिणाम (English)</Label>
                  <Textarea
                    value={storyForm.impactEn}
                    onChange={(e) => setStoryForm((prev) => ({ ...prev, impactEn: e.target.value }))}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>पूर्वीची प्रतिमा</Label>
                    <div className="mt-2">
                      {storyForm.beforeImage && (
                        <img
                          src={storyForm.beforeImage}
                          alt="Before"
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'before')}
                        className="hidden"
                        id="before-image"
                        disabled={isUploadingBefore}
                      />
                      <label
                        htmlFor="before-image"
                        className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">पूर्वीची प्रतिमा अपलोड करा</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>नंतरची प्रतिमा</Label>
                    <div className="mt-2">
                      {storyForm.afterImage && (
                        <img
                          src={storyForm.afterImage}
                          alt="After"
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'after')}
                        className="hidden"
                        id="after-image"
                        disabled={isUploadingAfter}
                      />
                      <label
                        htmlFor="after-image"
                        className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">नंतरची प्रतिमा अपलोड करा</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थान (मराठी)</Label>
                    <Input
                      value={storyForm.location}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थान (English)</Label>
                    <Input
                      value={storyForm.locationEn}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, locationEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>तारीख</Label>
                    <Input
                      value={storyForm.date}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>रेटिंग (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={storyForm.rating}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, rating: Number(e.target.value) || 5 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={storyForm.order}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>लाभ</Label>
                  <div className="space-y-2">
                    {storyForm.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={benefit} readOnly />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBenefit(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="नवीन लाभ जोडा"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addBenefit();
                          }
                        }}
                      />
                      <Button type="button" onClick={addBenefit}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={storyForm.isStar}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, isStar: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">स्टार कथा</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={storyForm.isActive}
                      onChange={(e) => setStoryForm((prev) => ({ ...prev, isActive: e.target.checked }))}
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
                      setStoryModalOpen(false);
                      resetStoryForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingStory ? 'अपडेट करा' : 'जोडा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

