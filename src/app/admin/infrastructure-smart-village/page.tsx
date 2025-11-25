'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Droplet, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  DEMO_INFRASTRUCTURE_FACILITIES,
  DEMO_SMART_VILLAGE_METRICS,
  DEMO_SERVICE_STATUS_ITEMS,
  DEMO_INFRASTRUCTURE_PAGE_SETTING,
  InfrastructureHighlightPill,
  InfrastructurePageSettingContent
} from '@/lib/demo-smart-village';

interface InfrastructureFacility {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  isActive: boolean;
  order: number;
}

interface SmartVillageMetric {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  status: string;
  statusEn: string;
  uptime?: number | null;
  supplyHours?: number | null;
  quality?: string | null;
  usage?: string | null;
  pressure?: string | null;
  metadata?: Record<string, any> | null;
  lastUpdated?: string | null;
  isActive: boolean;
  order: number;
}

interface ServiceStatusItem {
  id: string;
  title: string;
  titleEn: string;
  status: string;
  statusEn: string;
  uptime?: number | null;
  responseTime?: number | null;
  description?: string | null;
  descriptionEn?: string | null;
  lastUpdated?: string | null;
  isActive: boolean;
  order: number;
}

interface InfrastructurePageSetting extends InfrastructurePageSettingContent {
  id?: string;
  isActive: boolean;
}

type InfrastructurePageSettingForm = Omit<InfrastructurePageSettingContent, 'smartDashboardMeta'> & {
  smartDashboardMeta: string;
  isActive: boolean;
};

type TabKey = 'overview' | 'facilities' | 'metrics' | 'services';

const tabs: { id: TabKey; label: string; description: string }[] = [
  {
    id: 'overview',
    label: 'पृष्ठ सेटिंग्स',
    description: 'हीरो, हायलाइट्स आणि CTA कॉपी'
  },
  {
    id: 'facilities',
    label: 'मूलभूत सुविधा',
    description: 'पाणी, रस्ते, शाळा यांसारख्या प्रमुख सुविधा'
  },
  {
    id: 'metrics',
    label: 'स्मार्ट डॅशबोर्ड',
    description: 'वीज, पाणी, इंटरनेट, हवामानाची रियल-टाइम माहिती'
  },
  {
    id: 'services',
    label: 'सेवा स्थिती',
    description: 'उपयोगिता सेवांची अपटाइम आणि प्रतिसाद वेळ'
  }
];

const formatDateForInput = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const emptyHighlightPill: InfrastructureHighlightPill = { label: '', labelEn: '' };

const ensureHighlightPills = (items?: InfrastructureHighlightPill[] | null) => {
  if (!items || items.length === 0) {
    return [{ ...emptyHighlightPill }];
  }
  return items.map((pill) => ({
    label: pill?.label || '',
    labelEn: pill?.labelEn || ''
  }));
};

const mapSettingToForm = (
  setting: InfrastructurePageSetting | (InfrastructurePageSettingContent & { isActive?: boolean })
): InfrastructurePageSettingForm => ({
  heroTagline: setting.heroTagline || '',
  heroTaglineEn: setting.heroTaglineEn || '',
  heroTitle: setting.heroTitle || '',
  heroTitleEn: setting.heroTitleEn || '',
  heroSubtitle: setting.heroSubtitle || '',
  heroSubtitleEn: setting.heroSubtitleEn || '',
  heroDescription: setting.heroDescription || '',
  heroDescriptionEn: setting.heroDescriptionEn || '',
  highlightPills: ensureHighlightPills(setting.highlightPills),
  overviewHeading: setting.overviewHeading || '',
  overviewHeadingEn: setting.overviewHeadingEn || '',
  overviewDescription: setting.overviewDescription || '',
  overviewDescriptionEn: setting.overviewDescriptionEn || '',
  ctaTitle: setting.ctaTitle || '',
  ctaTitleEn: setting.ctaTitleEn || '',
  ctaDescription: setting.ctaDescription || '',
  ctaDescriptionEn: setting.ctaDescriptionEn || '',
  ctaSubtext: setting.ctaSubtext || '',
  ctaSubtextEn: setting.ctaSubtextEn || '',
  ctaPrimaryAction: setting.ctaPrimaryAction || '',
  ctaPrimaryActionEn: setting.ctaPrimaryActionEn || '',
  ctaSecondaryAction: setting.ctaSecondaryAction || '',
  ctaSecondaryActionEn: setting.ctaSecondaryActionEn || '',
  governmentBadge: setting.governmentBadge || '',
  governmentBadgeEn: setting.governmentBadgeEn || '',
  smartDashboardMeta: setting.smartDashboardMeta
    ? JSON.stringify(setting.smartDashboardMeta, null, 2)
    : '',
  isActive: 'isActive' in setting ? Boolean((setting as InfrastructurePageSetting).isActive) : true
});

const createEmptyPageSettingForm = (): InfrastructurePageSettingForm =>
  mapSettingToForm({
    heroTagline: '',
    heroTaglineEn: '',
    heroTitle: '',
    heroTitleEn: '',
    heroSubtitle: '',
    heroSubtitleEn: '',
    heroDescription: '',
    heroDescriptionEn: '',
    highlightPills: [],
    overviewHeading: '',
    overviewHeadingEn: '',
    overviewDescription: '',
    overviewDescriptionEn: '',
    ctaTitle: '',
    ctaTitleEn: '',
    ctaDescription: '',
    ctaDescriptionEn: '',
    ctaSubtext: '',
    ctaSubtextEn: '',
    ctaPrimaryAction: '',
    ctaPrimaryActionEn: '',
    ctaSecondaryAction: '',
    ctaSecondaryActionEn: '',
    governmentBadge: '',
    governmentBadgeEn: ''
  });

export default function InfrastructureSmartVillageAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [pageSetting, setPageSetting] = useState<InfrastructurePageSetting | null>(null);
  const [pageSettingForm, setPageSettingForm] = useState<InfrastructurePageSettingForm>(
    createEmptyPageSettingForm()
  );
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>([]);
  const [metrics, setMetrics] = useState<SmartVillageMetric[]>([]);
  const [services, setServices] = useState<ServiceStatusItem[]>([]);

  const [isPageSettingLoading, setIsPageSettingLoading] = useState(true);
  const [isFacilitiesDemo, setIsFacilitiesDemo] = useState(false);
  const [isMetricsDemo, setIsMetricsDemo] = useState(false);
  const [isServicesDemo, setIsServicesDemo] = useState(false);

  const [isPageSettingDemo, setIsPageSettingDemo] = useState(false);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(true);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [isSavingPageSetting, setIsSavingPageSetting] = useState(false);

  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<InfrastructureFacility | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    title: '',
    titleEn: '',
    icon: 'Droplet',
    description: '',
    descriptionEn: '',
    order: 0,
    isActive: true
  });

  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<SmartVillageMetric | null>(null);
  const [metricForm, setMetricForm] = useState({
    title: '',
    titleEn: '',
    type: 'electricity',
    status: '',
    statusEn: '',
    uptime: '',
    supplyHours: '',
    quality: '',
    usage: '',
    pressure: '',
    metadata: '',
    lastUpdated: '',
    order: 0,
    isActive: true
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceStatusItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    titleEn: '',
    status: '',
    statusEn: '',
    uptime: '',
    responseTime: '',
    description: '',
    descriptionEn: '',
    lastUpdated: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPageSetting();
    fetchFacilities();
    fetchMetrics();
    fetchServices();
  }, []);

  const fetchPageSetting = async () => {
    setIsPageSettingLoading(true);
    try {
      const response = await fetch('/api/infrastructure-page-settings');
      if (response.ok) {
        const data = await response.json();
        const rawSetting = data?.setting;
        const normalizedSetting: InfrastructurePageSetting | null = rawSetting
          ? {
              ...rawSetting,
              highlightPills: ensureHighlightPills(
                (rawSetting.highlightPills as InfrastructureHighlightPill[]) || []
              ),
              smartDashboardMeta: rawSetting.smartDashboardMeta ?? null,
              isActive: rawSetting.isActive ?? true
            }
          : null;

        const fallbackSource =
          normalizedSetting ??
          ({
            ...DEMO_INFRASTRUCTURE_PAGE_SETTING,
            isActive: true
          } as InfrastructurePageSetting);

        setPageSetting(normalizedSetting);
        setIsPageSettingDemo(Boolean(data?.isDemo) || !normalizedSetting);
        setPageSettingForm(mapSettingToForm(fallbackSource));
      } else {
        toast.error('पृष्ठ सेटिंग्स लोड करू शकलो नाही');
      }
    } catch (error) {
      console.error('Error fetching infrastructure page settings:', error);
      toast.error('पृष्ठ सेटिंग्स लोड करताना त्रुटी आली');
    } finally {
      setIsPageSettingLoading(false);
    }
  };

  const fetchFacilities = async () => {
    setIsFacilitiesLoading(true);
    try {
      const response = await fetch('/api/infrastructure-facilities');
      if (response.ok) {
        const data = await response.json();
        if (!data || data.length === 0) {
          setFacilities(DEMO_INFRASTRUCTURE_FACILITIES as InfrastructureFacility[]);
          setIsFacilitiesDemo(true);
        } else {
          setFacilities(data);
          setIsFacilitiesDemo(false);
        }
      } else {
        toast.error('सुविधा लोड करू शकलो नाही');
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('सुविधा लोड करताना त्रुटी आली');
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setIsMetricsLoading(true);
    try {
      const response = await fetch('/api/smart-village-metrics');
      if (response.ok) {
        const data = await response.json();
        if (!data || data.length === 0) {
          setMetrics(DEMO_SMART_VILLAGE_METRICS as SmartVillageMetric[]);
          setIsMetricsDemo(true);
        } else {
          setMetrics(data);
          setIsMetricsDemo(false);
        }
      } else {
        toast.error('डॅशबोर्ड मेट्रिक्स लोड करू शकलो नाही');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('डॅशबोर्ड मेट्रिक्स लोड करताना त्रुटी आली');
    } finally {
      setIsMetricsLoading(false);
    }
  };

  const fetchServices = async () => {
    setIsServicesLoading(true);
    try {
      const response = await fetch('/api/service-status-items');
      if (response.ok) {
        const data = await response.json();
        if (!data || data.length === 0) {
          setServices(DEMO_SERVICE_STATUS_ITEMS as ServiceStatusItem[]);
          setIsServicesDemo(true);
        } else {
          setServices(data);
          setIsServicesDemo(false);
        }
      } else {
        toast.error('सेवा स्थिती लोड करू शकलो नाही');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('सेवा स्थिती लोड करताना त्रुटी आली');
    } finally {
      setIsServicesLoading(false);
    }
  };

  const resetFacilityForm = () => {
    setFacilityForm({
      title: '',
      titleEn: '',
      icon: 'Droplet',
      description: '',
      descriptionEn: '',
      order: 0,
      isActive: true
    });
  };

  const resetMetricForm = () => {
    setMetricForm({
      title: '',
      titleEn: '',
      type: 'electricity',
      status: '',
      statusEn: '',
      uptime: '',
      supplyHours: '',
      quality: '',
      usage: '',
      pressure: '',
      metadata: '',
      lastUpdated: '',
      order: 0,
      isActive: true
    });
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      titleEn: '',
      status: '',
      statusEn: '',
      uptime: '',
      responseTime: '',
      description: '',
      descriptionEn: '',
      lastUpdated: '',
      order: 0,
      isActive: true
    });
  };

  const handleHighlightChange = (
    index: number,
    field: keyof InfrastructureHighlightPill,
    value: string
  ) => {
    setPageSettingForm((prev) => {
      const highlightPills = [...prev.highlightPills];
      highlightPills[index] = {
        ...highlightPills[index],
        [field]: value
      };
      return { ...prev, highlightPills };
    });
  };

  const handleAddHighlightPill = () => {
    setPageSettingForm((prev) => ({
      ...prev,
      highlightPills: [...prev.highlightPills, { ...emptyHighlightPill }]
    }));
  };

  const handleRemoveHighlightPill = (index: number) => {
    setPageSettingForm((prev) => {
      const highlightPills = prev.highlightPills.filter((_, idx) => idx !== index);
      return {
        ...prev,
        highlightPills: highlightPills.length ? highlightPills : [{ ...emptyHighlightPill }]
      };
    });
  };

  const resetPageSettingForm = (
    source?: InfrastructurePageSetting | (InfrastructurePageSettingContent & { isActive?: boolean })
  ) => {
    if (source) {
      setPageSettingForm(mapSettingToForm(source));
      return;
    }

    if (pageSetting) {
      setPageSettingForm(mapSettingToForm(pageSetting));
      return;
    }

    setPageSettingForm(
      mapSettingToForm({
        ...DEMO_INFRASTRUCTURE_PAGE_SETTING,
        isActive: true
      })
    );
  };

  const handlePageSettingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let parsedMeta: Record<string, any> | null = null;

    if (pageSettingForm.smartDashboardMeta.trim()) {
      try {
        parsedMeta = JSON.parse(pageSettingForm.smartDashboardMeta);
      } catch (error) {
        toast.error('Smart Dashboard Metadata साठी वैध JSON द्या');
        return;
      }
    }

    const { smartDashboardMeta, ...rest } = pageSettingForm;
    const payload = {
      ...rest,
      highlightPills: rest.highlightPills,
      smartDashboardMeta: parsedMeta
    };

    setIsSavingPageSetting(true);
    try {
      const method = pageSetting?.id ? 'PUT' : 'POST';
      const body = pageSetting?.id ? { id: pageSetting.id, ...payload } : payload;
      const response = await fetch('/api/infrastructure-page-settings', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success('पृष्ठ सेटिंग्स सेव्ह केल्या');
        await fetchPageSetting();
      } else {
        toast.error('पृष्ठ सेटिंग्स सेव्ह करताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error saving infrastructure page settings:', error);
      toast.error('पृष्ठ सेटिंग्स सेव्ह करताना त्रुटी आली');
    } finally {
      setIsSavingPageSetting(false);
    }
  };

  const handleFacilitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingFacility ? `/api/infrastructure-facilities/${editingFacility.id}` : '/api/infrastructure-facilities';
      const method = editingFacility ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facilityForm)
      });

      if (response.ok) {
        toast.success(editingFacility ? 'सुविधा अपडेट केली' : 'नवीन सुविधा जोडली');
        setIsFacilityModalOpen(false);
        setEditingFacility(null);
        resetFacilityForm();
        await fetchFacilities();
      } else {
        toast.error('सुविधा सेव्ह करताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error('सुविधा सेव्ह करताना त्रुटी आली');
    }
  };

  const handleMetricSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let parsedMetadata: Record<string, any> | null = null;
      if (metricForm.metadata) {
        try {
          parsedMetadata = JSON.parse(metricForm.metadata);
        } catch (parseError) {
          toast.error('Metadata JSON वैध नाही');
          return;
        }
      }

      const url = editingMetric ? `/api/smart-village-metrics/${editingMetric.id}` : '/api/smart-village-metrics';
      const method = editingMetric ? 'PUT' : 'POST';

      const payload = {
        ...metricForm,
        uptime: metricForm.uptime ? parseFloat(metricForm.uptime) : null,
        supplyHours: metricForm.supplyHours ? parseFloat(metricForm.supplyHours) : null,
        metadata: parsedMetadata,
        lastUpdated: metricForm.lastUpdated ? new Date(metricForm.lastUpdated).toISOString() : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingMetric ? 'मेट्रिक अपडेट केले' : 'नवीन मेट्रिक जोडले');
        setIsMetricModalOpen(false);
        setEditingMetric(null);
        resetMetricForm();
        await fetchMetrics();
      } else {
        toast.error('मेट्रिक सेव्ह करताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error saving metric:', error);
      toast.error('मेट्रिक सेव्ह करताना त्रुटी आली');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingService ? `/api/service-status-items/${editingService.id}` : '/api/service-status-items';
      const method = editingService ? 'PUT' : 'POST';

      const payload = {
        ...serviceForm,
        uptime: serviceForm.uptime ? parseFloat(serviceForm.uptime) : null,
        responseTime: serviceForm.responseTime ? parseFloat(serviceForm.responseTime) : null,
        lastUpdated: serviceForm.lastUpdated ? new Date(serviceForm.lastUpdated).toISOString() : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingService ? 'सेवा स्थिती अपडेट केली' : 'नवीन सेवा स्थिती जोडली');
        setIsServiceModalOpen(false);
        setEditingService(null);
        resetServiceForm();
        await fetchServices();
      } else {
        toast.error('सेवा स्थिती सेव्ह करताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error saving service status:', error);
      toast.error('सेवा स्थिती सेव्ह करताना त्रुटी आली');
    }
  };

  const handleFacilityDelete = async (id: string) => {
    if (id.startsWith('demo-')) {
      toast.info('Demo डेटा हटवू शकत नाही. कृपया नवीन सुविधा जोडा.');
      return;
    }

    if (!confirm('तुम्हाला खात्री आहे?')) return;

    try {
      const response = await fetch(`/api/infrastructure-facilities/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('सुविधा हटवली');
        await fetchFacilities();
      } else {
        toast.error('सुविधा हटवताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('सुविधा हटवताना त्रुटी आली');
    }
  };

  const handleMetricDelete = async (id: string) => {
    if (id.startsWith('demo-')) {
      toast.info('Demo डेटा हटवू शकत नाही. कृपया नवीन मेट्रिक जोडा.');
      return;
    }

    if (!confirm('तुम्हाला खात्री आहे?')) return;

    try {
      const response = await fetch(`/api/smart-village-metrics/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('मेट्रिक हटवले');
        await fetchMetrics();
      } else {
        toast.error('मेट्रिक हटवताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast.error('मेट्रिक हटवताना त्रुटी आली');
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (id.startsWith('demo-')) {
      toast.info('Demo डेटा हटवू शकत नाही. कृपया नवीन नोंद जोडा.');
      return;
    }

    if (!confirm('तुम्हाला खात्री आहे?')) return;

    try {
      const response = await fetch(`/api/service-status-items/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('सेवा स्थिती हटवली');
        await fetchServices();
      } else {
        toast.error('सेवा स्थिती हटवताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Error deleting service status:', error);
      toast.error('सेवा स्थिती हटवताना त्रुटी आली');
    }
  };

  const renderDemoNotice = (message: string) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
      <div>
        <p className="text-sm text-blue-800 font-medium">नोंद: {message}</p>
        <p className="text-xs text-blue-700 mt-1">
          Note: This is demo data. Add a new entry to start managing your own content.
        </p>
      </div>
    </div>
  );

  const renderOverviewTab = () => {
    let dashboardMetaPreview: Record<string, any> | null = null;
    let dashboardMetaError = false;
    if (pageSettingForm.smartDashboardMeta.trim()) {
      try {
        dashboardMetaPreview = JSON.parse(pageSettingForm.smartDashboardMeta);
      } catch {
        dashboardMetaError = true;
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">पृष्ठ सेटिंग्स</h2>
            <p className="text-gray-600">हीरो, हायलाइट्स आणि CTA कॉपी व्यवस्थापित करा</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => resetPageSettingForm()}>
              {pageSetting ? 'रीसेट' : 'डेमो डेटा'}
            </Button>
            <Button variant="outline" onClick={() => fetchPageSetting()}>
              रीफ्रेश
            </Button>
          </div>
        </div>

        {isPageSettingDemo &&
          renderDemoNotice(
            'हे डेमो कॉन्टेंट आहे. नवीन मजकूर सेव्ह करून स्वतःचा डेटा सेट करा.'
          )}

        {isPageSettingLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">कॉपी संपादित करा</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  हीरो विभाग, हायलाइट्स आणि CTA ब्लॉक अपडेट करा
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePageSettingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>हीरो टॅगलाइन (मराठी)</Label>
                      <Input
                        value={pageSettingForm.heroTagline}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroTagline: e.target.value }))
                        }
                        placeholder="पायाभूत"
                      />
                    </div>
                    <div>
                      <Label>Hero Tagline (English)</Label>
                      <Input
                        value={pageSettingForm.heroTaglineEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroTaglineEn: e.target.value }))
                        }
                        placeholder="Infrastructure"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>हीरो शीर्षक (मराठी)</Label>
                      <Input
                        value={pageSettingForm.heroTitle}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroTitle: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Hero Title (English)</Label>
                      <Input
                        value={pageSettingForm.heroTitleEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroTitleEn: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>हीरो उपशीर्षक (मराठी)</Label>
                      <Input
                        value={pageSettingForm.heroSubtitle}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Hero Subtitle (English)</Label>
                      <Input
                        value={pageSettingForm.heroSubtitleEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, heroSubtitleEn: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>हीरो वर्णन (मराठी)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.heroDescription}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            heroDescription: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Hero Description (English)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.heroDescriptionEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            heroDescriptionEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">हायलाइट पिल्स</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddHighlightPill}>
                        <Plus className="h-4 w-4 mr-1" />
                        नवीन जोडा
                      </Button>
                    </div>
                    {pageSettingForm.highlightPills.map((pill, index) => (
                      <div
                        key={`highlight-${index}`}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 relative"
                      >
                        <div>
                          <Label>लेबल (मराठी)</Label>
                          <Input
                            value={pill.label}
                            onChange={(e) => handleHighlightChange(index, 'label', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Label (English)</Label>
                          <Input
                            value={pill.labelEn}
                            onChange={(e) => handleHighlightChange(index, 'labelEn', e.target.value)}
                          />
                        </div>
                        {pageSettingForm.highlightPills.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveHighlightPill(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>आढावा शीर्षक (मराठी)</Label>
                      <Input
                        value={pageSettingForm.overviewHeading}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            overviewHeading: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Overview Title (English)</Label>
                      <Input
                        value={pageSettingForm.overviewHeadingEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            overviewHeadingEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>आढावा वर्णन (मराठी)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.overviewDescription}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            overviewDescription: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Overview Description (English)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.overviewDescriptionEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            overviewDescriptionEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>CTA शीर्षक (मराठी)</Label>
                      <Input
                        value={pageSettingForm.ctaTitle}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, ctaTitle: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>CTA Title (English)</Label>
                      <Input
                        value={pageSettingForm.ctaTitleEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, ctaTitleEn: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>CTA वर्णन (मराठी)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.ctaDescription}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaDescription: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>CTA Description (English)</Label>
                      <Textarea
                        rows={3}
                        value={pageSettingForm.ctaDescriptionEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaDescriptionEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>CTA सबटेक्स्ट (मराठी)</Label>
                      <Input
                        value={pageSettingForm.ctaSubtext}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, ctaSubtext: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>CTA Subtext (English)</Label>
                      <Input
                        value={pageSettingForm.ctaSubtextEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({ ...prev, ctaSubtextEn: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>प्राथमिक बटण (मराठी)</Label>
                      <Input
                        value={pageSettingForm.ctaPrimaryAction}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaPrimaryAction: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Primary Action (English)</Label>
                      <Input
                        value={pageSettingForm.ctaPrimaryActionEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaPrimaryActionEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>दुसरे बटण (मराठी)</Label>
                      <Input
                        value={pageSettingForm.ctaSecondaryAction}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaSecondaryAction: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Secondary Action (English)</Label>
                      <Input
                        value={pageSettingForm.ctaSecondaryActionEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            ctaSecondaryActionEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>गव्हर्नमेंट बॅज (मराठी)</Label>
                      <Input
                        value={pageSettingForm.governmentBadge}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            governmentBadge: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Government Badge (English)</Label>
                      <Input
                        value={pageSettingForm.governmentBadgeEn}
                        onChange={(e) =>
                          setPageSettingForm((prev) => ({
                            ...prev,
                            governmentBadgeEn: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Smart Dashboard Metadata (JSON)</Label>
                    <Textarea
                      rows={4}
                      value={pageSettingForm.smartDashboardMeta}
                      onChange={(e) =>
                        setPageSettingForm((prev) => ({
                          ...prev,
                          smartDashboardMeta: e.target.value
                        }))
                      }
                      placeholder='{ "statusLabel": "रियल-टाइम स्थिती" }'
                    />
                    {dashboardMetaError && (
                      <p className="text-sm text-red-600 mt-1">JSON वैध नाही</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pageSettingForm.isActive}
                      onChange={(e) =>
                        setPageSettingForm((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                    />
                    <span className="text-sm text-gray-700">सक्रिय</span>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => resetPageSettingForm()}>
                      रीसेट
                    </Button>
                    <Button type="submit" disabled={isSavingPageSetting}>
                      {isSavingPageSetting ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-blue-700 border-blue-200">
                      {pageSettingForm.heroTagline || 'टॅगलाइन'}
                    </Badge>
                    {pageSettingForm.heroTaglineEn && (
                      <span className="text-xs text-gray-500">{pageSettingForm.heroTaglineEn}</span>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mt-3">
                    {pageSettingForm.heroTitle || 'ग्राम पायाभूत सुविधा आणि सुविधा'}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{pageSettingForm.heroDescription}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pageSettingForm.highlightPills.map((pill, index) => (
                      <Badge key={`preview-pill-${index}`} variant="secondary">
                        {pill.label || pill.labelEn || 'हायलाइट'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {pageSettingForm.governmentBadge && (
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        {pageSettingForm.governmentBadge}
                      </Badge>
                    )}
                    {pageSettingForm.governmentBadgeEn && (
                      <span className="text-xs text-gray-500">{pageSettingForm.governmentBadgeEn}</span>
                    )}
                  </div>
                  <CardTitle className="text-xl text-gray-900 mt-3">
                    {pageSettingForm.ctaTitle || 'महाराष्ट्र शासन'}
                  </CardTitle>
                  <p className="text-gray-700 mt-2">{pageSettingForm.ctaDescription}</p>
                  <p className="text-sm text-gray-500">{pageSettingForm.ctaDescriptionEn}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{pageSettingForm.ctaSubtext}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {pageSettingForm.ctaPrimaryAction && (
                      <Button size="sm">{pageSettingForm.ctaPrimaryAction}</Button>
                    )}
                    {pageSettingForm.ctaSecondaryAction && (
                      <Button size="sm" variant="outline">
                        {pageSettingForm.ctaSecondaryAction}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {dashboardMetaPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Smart Dashboard Labels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {Object.entries(dashboardMetaPreview).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-gray-700">
                        <span>{key}</span>
                        <span className="font-semibold text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFacilitiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">प्रमुख सुविधा</h2>
          <p className="text-gray-600">ग्राम पायाभूत सुविधांची माहिती</p>
        </div>
        <Button
          onClick={() => {
            setEditingFacility(null);
            resetFacilityForm();
            setIsFacilityModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          नवीन सुविधा जोडा
        </Button>
      </div>

      {isFacilitiesDemo && renderDemoNotice('हे डेमो सुविधा आहेत. नवीन सुविधा जोडून स्वतःचा डेटा तयार करा.')}

      {isFacilitiesLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => {
            const isDemo = facility.id?.startsWith('demo-');
            return (
              <Card key={facility.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{facility.title}</CardTitle>
                    <Badge variant={facility.isActive ? 'secondary' : 'outline'}>
                      {facility.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{facility.titleEn}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{facility.description}</p>
                  <p className="text-sm text-gray-500">{facility.descriptionEn}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={isDemo}
                      onClick={() => {
                        setEditingFacility(facility);
                        setFacilityForm({
                          title: facility.title,
                          titleEn: facility.titleEn,
                          icon: facility.icon,
                          description: facility.description,
                          descriptionEn: facility.descriptionEn,
                          order: facility.order,
                          isActive: facility.isActive
                        });
                        setIsFacilityModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित करा
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={isDemo}
                      onClick={() => handleFacilityDelete(facility.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderMetricsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">स्मार्ट व्हिलेज मेट्रिक्स</h2>
          <p className="text-gray-600">वीज, पाणी, इंटरनेट, हवामान इत्यादी</p>
        </div>
        <Button
          onClick={() => {
            setEditingMetric(null);
            resetMetricForm();
            setIsMetricModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          नवीन मेट्रिक जोडा
        </Button>
      </div>

      {isMetricsDemo && renderDemoNotice('हे डेमो मेट्रिक्स आहेत. नवीन मेट्रिक जोडून स्वतःचा डेटा तयार करा.')}

      {isMetricsLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => {
            const isDemo = metric.id?.startsWith('demo-');
            return (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{metric.title}</CardTitle>
                    <Badge variant={metric.isActive ? 'secondary' : 'outline'}>
                      {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{metric.titleEn}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Droplet className="h-4 w-4" />
                    <span>स्थिती: {metric.status}</span>
                  </div>
                  {metric.uptime !== null && metric.uptime !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity className="h-4 w-4" />
                      <span>अपटाइम: {metric.uptime}%</span>
                    </div>
                  )}
                  {metric.supplyHours && (
                    <p className="text-sm text-gray-600">पुरवठा तास: {metric.supplyHours}</p>
                  )}
                  {metric.quality && (
                    <p className="text-sm text-gray-600">गुणवत्ता: {metric.quality}</p>
                  )}
                  {metric.usage && (
                    <p className="text-sm text-gray-600">वापर: {metric.usage}</p>
                  )}
                  {metric.metadata && (
                    <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-600 whitespace-pre-line">
                      {Object.entries(metric.metadata).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                  {metric.lastUpdated && (
                    <p className="text-xs text-gray-500">
                      अद्यतन: {new Date(metric.lastUpdated).toLocaleString('mr-IN')}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={isDemo}
                      onClick={() => {
                        setEditingMetric(metric);
                        setMetricForm({
                          title: metric.title,
                          titleEn: metric.titleEn,
                          type: metric.type,
                          status: metric.status,
                          statusEn: metric.statusEn,
                          uptime: metric.uptime?.toString() || '',
                          supplyHours: metric.supplyHours?.toString() || '',
                          quality: metric.quality || '',
                          usage: metric.usage || '',
                          pressure: metric.pressure || '',
                          metadata:
                            metric.metadata && Object.keys(metric.metadata).length
                              ? JSON.stringify(metric.metadata, null, 2)
                              : '',
                          lastUpdated: formatDateForInput(metric.lastUpdated),
                          order: metric.order,
                          isActive: metric.isActive
                        });
                        setIsMetricModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित करा
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={isDemo}
                      onClick={() => handleMetricDelete(metric.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">सेवा स्थिती</h2>
          <p className="text-gray-600">पाणी, वीज, इंटरनेट आणि स्वच्छता सेवा</p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            resetServiceForm();
            setIsServiceModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          नवीन सेवा जोडा
        </Button>
      </div>

      {isServicesDemo && renderDemoNotice('हे डेमो सेवा-स्थिती आहेत. नवीन नोंद जोडून स्वतःचा डेटा तयार करा.')}

      {isServicesLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isDemo = service.id?.startsWith('demo-');
            return (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{service.title}</CardTitle>
                    <Badge variant={service.isActive ? 'secondary' : 'outline'}>
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{service.titleEn}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.description && (
                    <p className="text-sm text-gray-600">{service.description}</p>
                  )}
                  {service.uptime !== null && service.uptime !== undefined && (
                    <p className="text-sm text-gray-600">अपटाइम: {service.uptime}%</p>
                  )}
                  {service.responseTime !== null && service.responseTime !== undefined && (
                    <p className="text-sm text-gray-600">
                      प्रतिसाद वेळ: {service.responseTime}s
                    </p>
                  )}
                  {service.lastUpdated && (
                    <p className="text-xs text-gray-500">
                      अद्यतन: {new Date(service.lastUpdated).toLocaleDateString('mr-IN')}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={isDemo}
                      onClick={() => {
                        setEditingService(service);
                        setServiceForm({
                          title: service.title,
                          titleEn: service.titleEn,
                          status: service.status,
                          statusEn: service.statusEn,
                          uptime: service.uptime?.toString() || '',
                          responseTime: service.responseTime?.toString() || '',
                          description: service.description || '',
                          descriptionEn: service.descriptionEn || '',
                          lastUpdated: formatDateForInput(service.lastUpdated),
                          order: service.order,
                          isActive: service.isActive
                        });
                        setIsServiceModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित करा
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={isDemo}
                      onClick={() => handleServiceDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">पायाभूत सुविधा आणि स्मार्ट व्हिलेज</h1>
        <p className="text-gray-600 mt-2">
          ग्राम पायाभूत सुविधा, स्मार्ट डॅशबोर्ड आणि सेवा स्थिती व्यवस्थापित करा
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'facilities' && renderFacilitiesTab()}
        {activeTab === 'metrics' && renderMetricsTab()}
        {activeTab === 'services' && renderServicesTab()}
      </div>

      {/* Facility Modal */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingFacility ? 'सुविधा संपादित करा' : 'नवीन सुविधा जोडा'}
              </h2>
              <form onSubmit={handleFacilitySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={facilityForm.title}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={facilityForm.titleEn}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={facilityForm.icon}
                      onChange={(e) => setFacilityForm((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="उदा. Droplet, MapPin"
                    />
                  </div>
                  <div>
                    <Label>क्रम (Order)</Label>
                    <Input
                      type="number"
                      value={facilityForm.order}
                      onChange={(e) =>
                        setFacilityForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={facilityForm.description}
                    onChange={(e) => setFacilityForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Description (English)</Label>
                  <Textarea
                    value={facilityForm.descriptionEn}
                    onChange={(e) => setFacilityForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={facilityForm.isActive}
                    onChange={(e) =>
                      setFacilityForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-gray-700">सक्रिय</span>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFacilityModalOpen(false);
                      setEditingFacility(null);
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

      {/* Metric Modal */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingMetric ? 'मेट्रिक संपादित करा' : 'नवीन मेट्रिक जोडा'}
              </h2>
              <form onSubmit={handleMetricSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={metricForm.title}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={metricForm.titleEn}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>प्रकार (Type)</Label>
                    <Input
                      value={metricForm.type}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, type: e.target.value }))}
                      placeholder="उदा. electricity, water, internet"
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रम (Order)</Label>
                    <Input
                      type="number"
                      value={metricForm.order}
                      onChange={(e) =>
                        setMetricForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={metricForm.status}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, status: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Status (English)</Label>
                    <Input
                      value={metricForm.statusEn}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, statusEn: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>अपटाइम (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricForm.uptime}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, uptime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>पुरवठा तास</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={metricForm.supplyHours}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, supplyHours: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>गुणवत्ता</Label>
                    <Input
                      value={metricForm.quality}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, quality: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>वापर / Pressure</Label>
                    <Input
                      value={metricForm.usage}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, usage: e.target.value }))}
                      placeholder="Usage details"
                    />
                    <Input
                      className="mt-2"
                      value={metricForm.pressure}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, pressure: e.target.value }))}
                      placeholder="Pressure or additional label"
                    />
                  </div>
                </div>
                <div>
                  <Label>Metadata (JSON)</Label>
                  <Textarea
                    rows={4}
                    value={metricForm.metadata}
                    onChange={(e) => setMetricForm((prev) => ({ ...prev, metadata: e.target.value }))}
                    placeholder='उदा. { "temperature": "28°C" }'
                  />
                </div>
                <div>
                  <Label>अद्यतन वेळ</Label>
                  <Input
                    type="datetime-local"
                    value={metricForm.lastUpdated}
                    onChange={(e) => setMetricForm((prev) => ({ ...prev, lastUpdated: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={metricForm.isActive}
                    onChange={(e) =>
                      setMetricForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-gray-700">सक्रिय</span>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsMetricModalOpen(false);
                      setEditingMetric(null);
                      resetMetricForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingMetric ? 'अपडेट करा' : 'जोडा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingService ? 'सेवा स्थिती संपादित करा' : 'नवीन सेवा स्थिती जोडा'}
              </h2>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={serviceForm.titleEn}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>स्थिती (मराठी)</Label>
                    <Input
                      value={serviceForm.status}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, status: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Status (English)</Label>
                    <Input
                      value={serviceForm.statusEn}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, statusEn: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>अपटाइम (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={serviceForm.uptime}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, uptime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>प्रतिसाद वेळ (सेकंद)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={serviceForm.responseTime}
                      onChange={(e) =>
                        setServiceForm((prev) => ({ ...prev, responseTime: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Description (English)</Label>
                  <Textarea
                    rows={3}
                    value={serviceForm.descriptionEn}
                    onChange={(e) =>
                      setServiceForm((prev) => ({ ...prev, descriptionEn: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>अद्यतन वेळ</Label>
                  <Input
                    type="datetime-local"
                    value={serviceForm.lastUpdated}
                    onChange={(e) =>
                      setServiceForm((prev) => ({ ...prev, lastUpdated: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>क्रम (Order)</Label>
                    <Input
                      type="number"
                      value={serviceForm.order}
                      onChange={(e) =>
                        setServiceForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <input
                      type="checkbox"
                      checked={serviceForm.isActive}
                      onChange={(e) =>
                        setServiceForm((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                    />
                    <span className="text-sm text-gray-700">सक्रिय</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsServiceModalOpen(false);
                      setEditingService(null);
                      resetServiceForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingService ? 'अपडेट करा' : 'जोडा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

