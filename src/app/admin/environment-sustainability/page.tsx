'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Activity, Leaf, Recycle, Droplets, TreePine, Calendar, Phone, X, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  environmentalMetricsDemoData,
  greenInitiativesDemoData,
  wasteManagementProgramsDemoData,
  waterConservationProjectsDemoData,
  adoptedTreesDemoData,
  environmentEventsDemoData,
  environmentContactInfoDemoData,
  EnvironmentalMetricData,
  GreenInitiativeData,
  WasteManagementProgramData,
  WaterConservationProjectData,
  AdoptedTreeData,
  EnvironmentEventData,
  EnvironmentContactInfoData
} from '@/lib/demo-environment-sustainability';

type TabType = 'metrics' | 'initiatives' | 'waste' | 'water' | 'trees' | 'events' | 'contact';

const emptyMetric: EnvironmentalMetricData = {
  metric: '',
  metricEn: '',
  description: '',
  descriptionEn: '',
  current: 0,
  target: 0,
  unit: '',
  unitEn: '',
  progress: 0,
  color: 'green',
  icon: 'TreePine',
  order: 0,
  isActive: true
};

const emptyInitiative: GreenInitiativeData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  status: '',
  statusEn: '',
  category: '',
  categoryEn: '',
  treesPlanted: 0,
  target: 0,
  participants: 0,
  startDate: '',
  endDate: '',
  impact: '',
  impactEn: '',
  order: 0,
  isActive: true
};

const emptyWaste: WasteManagementProgramData = {
  type: '',
  typeEn: '',
  description: '',
  descriptionEn: '',
  households: 0,
  totalHouseholds: 0,
  percentage: 0,
  status: '',
  statusEn: '',
  benefits: [],
  benefitsEn: [],
  order: 0,
  isActive: true
};

const emptyWater: WaterConservationProjectData = {
  project: '',
  projectEn: '',
  description: '',
  descriptionEn: '',
  capacity: '',
  capacityEn: '',
  locations: 0,
  status: '',
  statusEn: '',
  impact: '',
  impactEn: '',
  order: 0,
  isActive: true
};

const emptyTree: AdoptedTreeData = {
  treeName: '',
  treeNameEn: '',
  location: '',
  locationEn: '',
  adoptedBy: '',
  adoptedByEn: '',
  plantedDate: '',
  status: '',
  statusEn: '',
  height: '',
  heightEn: '',
  sponsor: '',
  careInstructions: '',
  order: 0,
  isActive: true
};

const emptyEvent: EnvironmentEventData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  date: '',
  time: '',
  location: '',
  locationEn: '',
  participants: 0,
  type: '',
  typeEn: '',
  order: 0,
  isActive: true
};

const emptyContact: EnvironmentContactInfoData = {
  section: 'environment',
  officeName: '',
  officeNameEn: '',
  phone: '',
  isActive: true
};

export default function EnvironmentSustainabilityAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [metrics, setMetrics] = useState<EnvironmentalMetricData[]>(environmentalMetricsDemoData);
  const [initiatives, setInitiatives] = useState<GreenInitiativeData[]>(greenInitiativesDemoData);
  const [wastePrograms, setWastePrograms] = useState<WasteManagementProgramData[]>(wasteManagementProgramsDemoData);
  const [waterProjects, setWaterProjects] = useState<WaterConservationProjectData[]>(waterConservationProjectsDemoData);
  const [trees, setTrees] = useState<AdoptedTreeData[]>(adoptedTreesDemoData);
  const [events, setEvents] = useState<EnvironmentEventData[]>(environmentEventsDemoData);
  const [contacts, setContacts] = useState<EnvironmentContactInfoData[]>(environmentContactInfoDemoData);
  
  const [isDemo, setIsDemo] = useState(true);
  
  // Modal states
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [initiativeModalOpen, setInitiativeModalOpen] = useState(false);
  const [wasteModalOpen, setWasteModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [treeModalOpen, setTreeModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Form states
  const [metricForm, setMetricForm] = useState<EnvironmentalMetricData>(emptyMetric);
  const [initiativeForm, setInitiativeForm] = useState<GreenInitiativeData>(emptyInitiative);
  const [wasteForm, setWasteForm] = useState<WasteManagementProgramData>(emptyWaste);
  const [waterForm, setWaterForm] = useState<WaterConservationProjectData>(emptyWater);
  const [treeForm, setTreeForm] = useState<AdoptedTreeData>(emptyTree);
  const [eventForm, setEventForm] = useState<EnvironmentEventData>(emptyEvent);
  const [contactForm, setContactForm] = useState<EnvironmentContactInfoData>(emptyContact);
  
  // Editing states
  const [editingMetric, setEditingMetric] = useState<EnvironmentalMetricData | null>(null);
  const [editingInitiative, setEditingInitiative] = useState<GreenInitiativeData | null>(null);
  const [editingWaste, setEditingWaste] = useState<WasteManagementProgramData | null>(null);
  const [editingWater, setEditingWater] = useState<WaterConservationProjectData | null>(null);
  const [editingTree, setEditingTree] = useState<AdoptedTreeData | null>(null);
  const [editingEvent, setEditingEvent] = useState<EnvironmentEventData | null>(null);
  const [editingContact, setEditingContact] = useState<EnvironmentContactInfoData | null>(null);
  
  // Array input states
  const [benefitInput, setBenefitInput] = useState('');
  const [benefitEnInput, setBenefitEnInput] = useState('');
  
  // Image upload states
  const [isUploadingTreeImage, setIsUploadingTreeImage] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [metricsRes, initiativesRes, wasteRes, waterRes, treesRes, eventsRes, contactsRes] = await Promise.all([
        fetch('/api/environmental-metrics'),
        fetch('/api/green-initiatives'),
        fetch('/api/waste-management'),
        fetch('/api/water-conservation'),
        fetch('/api/adopted-trees'),
        fetch('/api/environment-events'),
        fetch('/api/environment-contact')
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics?.length ? data.metrics : environmentalMetricsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (initiativesRes.ok) {
        const data = await initiativesRes.json();
        setInitiatives(data.initiatives?.length ? data.initiatives : greenInitiativesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (wasteRes.ok) {
        const data = await wasteRes.json();
        setWastePrograms(data.programs?.length ? data.programs : wasteManagementProgramsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (waterRes.ok) {
        const data = await waterRes.json();
        setWaterProjects(data.projects?.length ? data.projects : waterConservationProjectsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (treesRes.ok) {
        const data = await treesRes.json();
        setTrees(data.trees?.length ? data.trees : adoptedTreesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events?.length ? data.events : environmentEventsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts?.length ? data.contacts : environmentContactInfoDemoData);
        if (data.isDemo) setIsDemo(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('डेटा लोड करताना त्रुटी आली');
    } finally {
      setLoading(false);
    }
  };

  // Metric Management Functions
  const openMetricModal = (metric?: EnvironmentalMetricData) => {
    if (metric) {
      setEditingMetric(metric);
      setMetricForm(metric);
    } else {
      setEditingMetric(null);
      setMetricForm(emptyMetric);
    }
    setMetricModalOpen(true);
  };

  const handleMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingMetric ? 'PUT' : 'POST';
      const body = editingMetric ? { ...metricForm, id: editingMetric.id } : metricForm;
      
      // Calculate progress
      const progress = metricForm.target > 0 ? (metricForm.current / metricForm.target) * 100 : 0;
      body.progress = progress;

      const response = await fetch('/api/environmental-metrics', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save metric');

      toast.success(editingMetric ? 'निर्देशक अपडेट केला' : 'नवीन निर्देशक जोडला');
      setMetricModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('निर्देशक जतन करताना त्रुटी आली');
    }
  };

  const handleMetricDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हा निर्देशक हटवायचा आहे?')) return;

    try {
      const response = await fetch(`/api/environmental-metrics?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('निर्देशक हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('निर्देशक हटवताना त्रुटी आली');
    }
  };

  // Initiative Management Functions
  const openInitiativeModal = (initiative?: GreenInitiativeData) => {
    if (initiative) {
      setEditingInitiative(initiative);
      setInitiativeForm(initiative);
    } else {
      setEditingInitiative(null);
      setInitiativeForm(emptyInitiative);
    }
    setInitiativeModalOpen(true);
  };

  const handleInitiativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingInitiative ? 'PUT' : 'POST';
      const body = editingInitiative ? { ...initiativeForm, id: editingInitiative.id } : initiativeForm;

      const response = await fetch('/api/green-initiatives', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save initiative');

      toast.success(editingInitiative ? 'उपक्रम अपडेट केला' : 'नवीन उपक्रम जोडला');
      setInitiativeModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('उपक्रम जतन करताना त्रुटी आली');
    }
  };

  const handleInitiativeDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे उपक्रम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/green-initiatives?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('उपक्रम हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('उपक्रम हटवताना त्रुटी आली');
    }
  };

  // Waste Management Functions
  const openWasteModal = (program?: WasteManagementProgramData) => {
    if (program) {
      setEditingWaste(program);
      setWasteForm(program);
    } else {
      setEditingWaste(null);
      setWasteForm(emptyWaste);
    }
    setWasteModalOpen(true);
  };

  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingWaste ? 'PUT' : 'POST';
      const body = editingWaste ? { ...wasteForm, id: editingWaste.id } : wasteForm;
      
      // Calculate percentage
      const percentage = wasteForm.totalHouseholds > 0 
        ? (wasteForm.households / wasteForm.totalHouseholds) * 100 
        : 0;
      body.percentage = percentage;

      const response = await fetch('/api/waste-management', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save program');

      toast.success(editingWaste ? 'कार्यक्रम अपडेट केला' : 'नवीन कार्यक्रम जोडला');
      setWasteModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('कार्यक्रम जतन करताना त्रुटी आली');
    }
  };

  const handleWasteDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे कार्यक्रम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/waste-management?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('कार्यक्रम हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('कार्यक्रम हटवताना त्रुटी आली');
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim() && benefitEnInput.trim()) {
      setWasteForm(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefitInput.trim()],
        benefitsEn: [...(prev.benefitsEn || []), benefitEnInput.trim()]
      }));
      setBenefitInput('');
      setBenefitEnInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setWasteForm(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
      benefitsEn: prev.benefitsEn.filter((_, i) => i !== index)
    }));
  };

  // Water Conservation Functions
  const openWaterModal = (project?: WaterConservationProjectData) => {
    if (project) {
      setEditingWater(project);
      setWaterForm(project);
    } else {
      setEditingWater(null);
      setWaterForm(emptyWater);
    }
    setWaterModalOpen(true);
  };

  const handleWaterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingWater ? 'PUT' : 'POST';
      const body = editingWater ? { ...waterForm, id: editingWater.id } : waterForm;

      const response = await fetch('/api/water-conservation', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save project');

      toast.success(editingWater ? 'प्रकल्प अपडेट केला' : 'नवीन प्रकल्प जोडला');
      setWaterModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('प्रकल्प जतन करताना त्रुटी आली');
    }
  };

  const handleWaterDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे प्रकल्प हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/water-conservation?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('प्रकल्प हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('प्रकल्प हटवताना त्रुटी आली');
    }
  };

  // Tree Management Functions
  const openTreeModal = (tree?: AdoptedTreeData) => {
    if (tree) {
      setEditingTree(tree);
      setTreeForm(tree);
    } else {
      setEditingTree(null);
      setTreeForm(emptyTree);
    }
    setTreeModalOpen(true);
  };

  const handleTreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTree ? 'PUT' : 'POST';
      const body = editingTree ? { ...treeForm, id: editingTree.id } : treeForm;

      const response = await fetch('/api/adopted-trees', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save tree');

      toast.success(editingTree ? 'झाड अपडेट केले' : 'नवीन झाड जोडले');
      setTreeModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('झाड जतन करताना त्रुटी आली');
    }
  };

  const handleTreeDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे झाड हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/adopted-trees?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('झाड हटवले');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('झाड हटवताना त्रुटी आली');
    }
  };

  const handleTreeImageUpload = async (file: File) => {
    setIsUploadingTreeImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'trees');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setTreeForm(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('प्रतिमा अपलोड केली');
    } catch (error) {
      console.error(error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    } finally {
      setIsUploadingTreeImage(false);
    }
  };

  // Event Management Functions
  const openEventModal = (event?: EnvironmentEventData) => {
    if (event) {
      setEditingEvent(event);
      setEventForm(event);
    } else {
      setEditingEvent(null);
      setEventForm(emptyEvent);
    }
    setEventModalOpen(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent ? { ...eventForm, id: editingEvent.id } : eventForm;

      const response = await fetch('/api/environment-events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save event');

      toast.success(editingEvent ? 'कार्यक्रम अपडेट केला' : 'नवीन कार्यक्रम जोडला');
      setEventModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('कार्यक्रम जतन करताना त्रुटी आली');
    }
  };

  const handleEventDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे कार्यक्रम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/environment-events?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('कार्यक्रम हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('कार्यक्रम हटवताना त्रुटी आली');
    }
  };

  // Contact Management Functions
  const openContactModal = (contact?: EnvironmentContactInfoData) => {
    if (contact) {
      setEditingContact(contact);
      setContactForm(contact);
    } else {
      setEditingContact(null);
      setContactForm(emptyContact);
    }
    setContactModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = contactForm;

      const response = await fetch('/api/environment-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save contact');

      toast.success(editingContact ? 'संपर्क अपडेट केला' : 'नवीन संपर्क जोडला');
      setContactModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('संपर्क जतन करताना त्रुटी आली');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'metrics' as TabType, label: 'निर्देशक', icon: Activity },
    { id: 'initiatives' as TabType, label: 'हरित उपक्रम', icon: Leaf },
    { id: 'waste' as TabType, label: 'कचरा व्यवस्थापन', icon: Recycle },
    { id: 'water' as TabType, label: 'पाणी संवर्धन', icon: Droplets },
    { id: 'trees' as TabType, label: 'झाड प्रायोजित', icon: TreePine },
    { id: 'events' as TabType, label: 'कार्यक्रम', icon: Calendar },
    { id: 'contact' as TabType, label: 'संपर्क', icon: Phone }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">पर्यावरण आणि शाश्वत विकास</h1>
        <p className="text-gray-600 mt-2">
          पर्यावरणीय निर्देशक, हरित उपक्रम, कचरा व्यवस्थापन आणि पाणी संवर्धन व्यवस्थापन
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>पर्यावरणीय निर्देशक</CardTitle>
                <CardDescription>पर्यावरणीय निर्देशक व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openMetricModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन निर्देशक
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div key={metric.id || metric.metric} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{metric.metric}</h4>
                    <p className="text-sm text-gray-600">{metric.current} {metric.unit}</p>
                    <Badge variant={metric.isActive ? 'default' : 'secondary'} className="mt-2">
                      {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openMetricModal(metric)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMetricDelete(metric.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initiatives Tab */}
      {activeTab === 'initiatives' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>हरित उपक्रम</CardTitle>
                <CardDescription>हरित उपक्रम व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openInitiativeModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन उपक्रम
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initiatives.map((initiative) => (
                <div key={initiative.id || initiative.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{initiative.title}</h4>
                    <p className="text-sm text-gray-600">{initiative.category} - {initiative.status}</p>
                    <Badge variant={initiative.isActive ? 'default' : 'secondary'} className="mt-2">
                      {initiative.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openInitiativeModal(initiative)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleInitiativeDelete(initiative.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waste Management Tab */}
      {activeTab === 'waste' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>कचरा व्यवस्थापन</CardTitle>
                <CardDescription>कचरा व्यवस्थापन कार्यक्रम व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openWasteModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन कार्यक्रम
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wastePrograms.map((program) => (
                <div key={program.id || program.type} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{program.type}</h4>
                    <p className="text-sm text-gray-600">{program.households}/{program.totalHouseholds} घरे - {program.percentage}%</p>
                    <Badge variant={program.isActive ? 'default' : 'secondary'} className="mt-2">
                      {program.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openWasteModal(program)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleWasteDelete(program.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Water Conservation Tab */}
      {activeTab === 'water' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>पाणी संवर्धन</CardTitle>
                <CardDescription>पाणी संवर्धन प्रकल्प व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openWaterModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन प्रकल्प
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {waterProjects.map((project) => (
                <div key={project.id || project.project} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{project.project}</h4>
                    <p className="text-sm text-gray-600">{project.capacity} - {project.status}</p>
                    <Badge variant={project.isActive ? 'default' : 'secondary'} className="mt-2">
                      {project.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openWaterModal(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleWaterDelete(project.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adopted Trees Tab */}
      {activeTab === 'trees' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>झाड प्रायोजित</CardTitle>
                <CardDescription>प्रायोजित झाडे व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openTreeModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन झाड
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trees.map((tree) => (
                <div key={tree.id || tree.treeName} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{tree.treeName}</h4>
                    <p className="text-sm text-gray-600">{tree.adoptedBy} - {tree.location}</p>
                    <Badge variant={tree.isActive ? 'default' : 'secondary'} className="mt-2">
                      {tree.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openTreeModal(tree)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTreeDelete(tree.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>आगामी कार्यक्रम</CardTitle>
                <CardDescription>पर्यावरण कार्यक्रम व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openEventModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन कार्यक्रम
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id || event.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date} - {event.time}</p>
                    <Badge variant={event.isActive ? 'default' : 'secondary'} className="mt-2">
                      {event.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEventModal(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEventDelete(event.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>संपर्क माहिती</CardTitle>
                <CardDescription>प्रत्येक विभागासाठी संपर्क माहिती व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openContactModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन संपर्क
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id || contact.section} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{contact.officeName}</h4>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <Badge className="mt-2">{contact.section}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openContactModal(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metric Modal */}
      {metricModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingMetric ? 'निर्देशक संपादित करा' : 'नवीन निर्देशक जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setMetricModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleMetricSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>निर्देशक (मराठी)</Label>
                    <Input
                      value={metricForm.metric}
                      onChange={(e) => setMetricForm({ ...metricForm, metric: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>निर्देशक (English)</Label>
                    <Input
                      value={metricForm.metricEn}
                      onChange={(e) => setMetricForm({ ...metricForm, metricEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={metricForm.description}
                    onChange={(e) => setMetricForm({ ...metricForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={metricForm.descriptionEn}
                    onChange={(e) => setMetricForm({ ...metricForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>सध्याचे मूल्य</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metricForm.current}
                      onChange={(e) => {
                        const current = Number(e.target.value) || 0;
                        const progress = metricForm.target > 0 ? (current / metricForm.target) * 100 : 0;
                        setMetricForm({ ...metricForm, current, progress });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label>लक्ष्य</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metricForm.target}
                      onChange={(e) => {
                        const target = Number(e.target.value) || 0;
                        const progress = target > 0 ? (metricForm.current / target) * 100 : 0;
                        setMetricForm({ ...metricForm, target, progress });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label>युनिट (मराठी)</Label>
                    <Input
                      value={metricForm.unit}
                      onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>युनिट (English)</Label>
                    <Input
                      value={metricForm.unitEn}
                      onChange={(e) => setMetricForm({ ...metricForm, unitEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>रंग</Label>
                    <select
                      value={metricForm.color}
                      onChange={(e) => setMetricForm({ ...metricForm, color: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="green">हिरवा</option>
                      <option value="blue">निळा</option>
                      <option value="purple">जांभळा</option>
                      <option value="yellow">पिवळा</option>
                      <option value="orange">नारंगी</option>
                    </select>
                  </div>
                  <div>
                    <Label>आयकॉन</Label>
                    <Input
                      value={metricForm.icon}
                      onChange={(e) => setMetricForm({ ...metricForm, icon: e.target.value })}
                      placeholder="TreePine"
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रगती (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metricForm.progress}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={metricForm.isActive}
                      onChange={(e) => setMetricForm({ ...metricForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={metricForm.order}
                      onChange={(e) => setMetricForm({ ...metricForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setMetricModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Initiative Modal */}
      {initiativeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingInitiative ? 'उपक्रम संपादित करा' : 'नवीन उपक्रम जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setInitiativeModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleInitiativeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={initiativeForm.title}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={initiativeForm.titleEn}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={initiativeForm.description}
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={initiativeForm.descriptionEn}
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ग (मराठी)</Label>
                    <Input
                      value={initiativeForm.category}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग (English)</Label>
                    <Input
                      value={initiativeForm.categoryEn}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, categoryEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={initiativeForm.status}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, status: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={initiativeForm.statusEn}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, statusEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>झाडे लावली</Label>
                    <Input
                      type="number"
                      value={initiativeForm.treesPlanted}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, treesPlanted: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>लक्ष्य</Label>
                    <Input
                      type="number"
                      value={initiativeForm.target}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, target: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>सहभागी</Label>
                    <Input
                      type="number"
                      value={initiativeForm.participants}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, participants: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={initiativeForm.order}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>सुरुवात तारीख</Label>
                    <Input
                      type="date"
                      value={initiativeForm.startDate}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शेवट तारीख</Label>
                    <Input
                      type="date"
                      value={initiativeForm.endDate}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>परिणाम (मराठी)</Label>
                  <Input
                    value={initiativeForm.impact}
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, impact: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>परिणाम (English)</Label>
                  <Input
                    value={initiativeForm.impactEn}
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, impactEn: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={initiativeForm.isActive}
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setInitiativeModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Waste Management Modal */}
      {wasteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingWaste ? 'कार्यक्रम संपादित करा' : 'नवीन कार्यक्रम जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setWasteModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleWasteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकार (मराठी)</Label>
                    <Input
                      value={wasteForm.type}
                      onChange={(e) => setWasteForm({ ...wasteForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकार (English)</Label>
                    <Input
                      value={wasteForm.typeEn}
                      onChange={(e) => setWasteForm({ ...wasteForm, typeEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={wasteForm.description}
                    onChange={(e) => setWasteForm({ ...wasteForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={wasteForm.descriptionEn}
                    onChange={(e) => setWasteForm({ ...wasteForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>सहभागी घरे</Label>
                    <Input
                      type="number"
                      value={wasteForm.households}
                      onChange={(e) => {
                        const households = Number(e.target.value) || 0;
                        const percentage = wasteForm.totalHouseholds > 0 
                          ? (households / wasteForm.totalHouseholds) * 100 
                          : 0;
                        setWasteForm({ ...wasteForm, households, percentage });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label>एकूण घरे</Label>
                    <Input
                      type="number"
                      value={wasteForm.totalHouseholds}
                      onChange={(e) => {
                        const totalHouseholds = Number(e.target.value) || 0;
                        const percentage = totalHouseholds > 0 
                          ? (wasteForm.households / totalHouseholds) * 100 
                          : 0;
                        setWasteForm({ ...wasteForm, totalHouseholds, percentage });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label>टक्केवारी (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={wasteForm.percentage}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={wasteForm.order}
                      onChange={(e) => setWasteForm({ ...wasteForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={wasteForm.status}
                      onChange={(e) => setWasteForm({ ...wasteForm, status: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={wasteForm.statusEn}
                      onChange={(e) => setWasteForm({ ...wasteForm, statusEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>फायदे</Label>
                  <div className="space-y-2">
                    {wasteForm.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={benefit} readOnly />
                        <Input value={wasteForm.benefitsEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeBenefit(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="फायदा (मराठी)"
                      />
                      <Input
                        value={benefitEnInput}
                        onChange={(e) => setBenefitEnInput(e.target.value)}
                        placeholder="Benefit (English)"
                      />
                      <Button type="button" onClick={addBenefit}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={wasteForm.isActive}
                    onChange={(e) => setWasteForm({ ...wasteForm, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setWasteModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Water Conservation Modal */}
      {waterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingWater ? 'प्रकल्प संपादित करा' : 'नवीन प्रकल्प जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setWaterModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleWaterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकल्प (मराठी)</Label>
                    <Input
                      value={waterForm.project}
                      onChange={(e) => setWaterForm({ ...waterForm, project: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकल्प (English)</Label>
                    <Input
                      value={waterForm.projectEn}
                      onChange={(e) => setWaterForm({ ...waterForm, projectEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={waterForm.description}
                    onChange={(e) => setWaterForm({ ...waterForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={waterForm.descriptionEn}
                    onChange={(e) => setWaterForm({ ...waterForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>क्षमता (मराठी)</Label>
                    <Input
                      value={waterForm.capacity}
                      onChange={(e) => setWaterForm({ ...waterForm, capacity: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्षमता (English)</Label>
                    <Input
                      value={waterForm.capacityEn}
                      onChange={(e) => setWaterForm({ ...waterForm, capacityEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>स्थाने</Label>
                    <Input
                      type="number"
                      value={waterForm.locations}
                      onChange={(e) => setWaterForm({ ...waterForm, locations: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={waterForm.order}
                      onChange={(e) => setWaterForm({ ...waterForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      checked={waterForm.isActive}
                      onChange={(e) => setWaterForm({ ...waterForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={waterForm.status}
                      onChange={(e) => setWaterForm({ ...waterForm, status: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={waterForm.statusEn}
                      onChange={(e) => setWaterForm({ ...waterForm, statusEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>परिणाम (मराठी)</Label>
                  <Input
                    value={waterForm.impact}
                    onChange={(e) => setWaterForm({ ...waterForm, impact: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>परिणाम (English)</Label>
                  <Input
                    value={waterForm.impactEn}
                    onChange={(e) => setWaterForm({ ...waterForm, impactEn: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setWaterModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tree Modal */}
      {treeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingTree ? 'झाड संपादित करा' : 'नवीन झाड जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setTreeModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleTreeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>झाडाचे नाव (मराठी)</Label>
                    <Input
                      value={treeForm.treeName}
                      onChange={(e) => setTreeForm({ ...treeForm, treeName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>झाडाचे नाव (English)</Label>
                    <Input
                      value={treeForm.treeNameEn}
                      onChange={(e) => setTreeForm({ ...treeForm, treeNameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थान (मराठी)</Label>
                    <Input
                      value={treeForm.location}
                      onChange={(e) => setTreeForm({ ...treeForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थान (English)</Label>
                    <Input
                      value={treeForm.locationEn}
                      onChange={(e) => setTreeForm({ ...treeForm, locationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रायोजक (मराठी)</Label>
                    <Input
                      value={treeForm.adoptedBy}
                      onChange={(e) => setTreeForm({ ...treeForm, adoptedBy: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रायोजक (English)</Label>
                    <Input
                      value={treeForm.adoptedByEn}
                      onChange={(e) => setTreeForm({ ...treeForm, adoptedByEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>लावण्याची तारीख</Label>
                    <Input
                      type="date"
                      value={treeForm.plantedDate}
                      onChange={(e) => setTreeForm({ ...treeForm, plantedDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>उंची (मराठी)</Label>
                    <Input
                      value={treeForm.height}
                      onChange={(e) => setTreeForm({ ...treeForm, height: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>उंची (English)</Label>
                    <Input
                      value={treeForm.heightEn}
                      onChange={(e) => setTreeForm({ ...treeForm, heightEn: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रायोजन रक्कम</Label>
                    <Input
                      value={treeForm.sponsor}
                      onChange={(e) => setTreeForm({ ...treeForm, sponsor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={treeForm.status}
                      onChange={(e) => setTreeForm({ ...treeForm, status: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती (English)</Label>
                    <Input
                      value={treeForm.statusEn}
                      onChange={(e) => setTreeForm({ ...treeForm, statusEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>काळजी सूचना (मराठी)</Label>
                  <Textarea
                    value={treeForm.careInstructions}
                    onChange={(e) => setTreeForm({ ...treeForm, careInstructions: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>काळजी सूचना (English) - Optional</Label>
                  <Textarea
                    value={treeForm.careInstructionsEn || ''}
                    onChange={(e) => setTreeForm({ ...treeForm, careInstructionsEn: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label>प्रतिमा URL (Optional)</Label>
                  <Input
                    value={treeForm.imageUrl || ''}
                    onChange={(e) => setTreeForm({ ...treeForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleTreeImageUpload(file);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={treeForm.isActive}
                      onChange={(e) => setTreeForm({ ...treeForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={treeForm.order}
                      onChange={(e) => setTreeForm({ ...treeForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setTreeModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingEvent ? 'कार्यक्रम संपादित करा' : 'नवीन कार्यक्रम जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setEventModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={eventForm.titleEn}
                      onChange={(e) => setEventForm({ ...eventForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={eventForm.descriptionEn}
                    onChange={(e) => setEventForm({ ...eventForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>तारीख</Label>
                    <Input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वेळ</Label>
                    <Input
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>सहभागी</Label>
                    <Input
                      type="number"
                      value={eventForm.participants}
                      onChange={(e) => setEventForm({ ...eventForm, participants: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थान (मराठी)</Label>
                    <Input
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थान (English)</Label>
                    <Input
                      value={eventForm.locationEn}
                      onChange={(e) => setEventForm({ ...eventForm, locationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकार (मराठी)</Label>
                    <Input
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकार (English)</Label>
                    <Input
                      value={eventForm.typeEn}
                      onChange={(e) => setEventForm({ ...eventForm, typeEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={eventForm.isActive}
                      onChange={(e) => setEventForm({ ...eventForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={eventForm.order}
                      onChange={(e) => setEventForm({ ...eventForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setEventModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingContact ? 'संपर्क संपादित करा' : 'नवीन संपर्क जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setContactModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label>विभाग</Label>
                  <select
                    value={contactForm.section}
                    onChange={(e) => setContactForm({ ...contactForm, section: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="environment">पर्यावरण</option>
                    <option value="green">हरित</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कार्यालय नाव (मराठी)</Label>
                    <Input
                      value={contactForm.officeName}
                      onChange={(e) => setContactForm({ ...contactForm, officeName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>कार्यालय नाव (English)</Label>
                    <Input
                      value={contactForm.officeNameEn}
                      onChange={(e) => setContactForm({ ...contactForm, officeNameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>फोन</Label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>ईमेल (Optional)</Label>
                    <Input
                      type="email"
                      value={contactForm.email || ''}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactForm.isActive}
                    onChange={(e) => setContactForm({ ...contactForm, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)}>
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


