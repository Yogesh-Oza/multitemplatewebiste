


'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FolderOpen,
  Gauge,
  Plus,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  DashboardAchievement,
  DashboardContentStat,
  DashboardContentStatBreakdown,
  DashboardKpiMetric,
  DashboardOverview,
  DashboardProgressIndicator,
  DashboardRecentActivity,
  DashboardWardComparison,
} from '@/types/dashboard';
import {
  getDemoDashboardActivities,
  getDemoDashboardAchievements,
  getDemoDashboardContentStats,
  getDemoDashboardKpis,
  getDemoDashboardOverview,
  getDemoDashboardProgressIndicators,
  getDemoDashboardWards,
} from '@/lib/demo-dashboard-data';

interface OverviewFormState {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  highlightText: string;
  highlightTextEn: string;
  isActive: boolean;
}

interface KpiFormState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  value: number;
  unit: string;
  unitEn: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface ProgressFormState {
  title: string;
  titleEn: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface ContentStatFormState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  breakdown: DashboardContentStatBreakdown[];
}

interface WardFormState {
  name: string;
  nameEn: string;
  population: number;
  households: number;
  sanitation: number;
  waterSupply: number;
  electricity: number;
  projects: number;
  complaints: number;
  resolvedComplaints: number;
  order: number;
  isActive: boolean;
}

interface AchievementFormState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  impact: string;
  impactEn: string;
  category: string;
  categoryEn: string;
  year: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface ActivityFormState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  activityDate: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

const overviewDefaults: OverviewFormState = {
  title: 'माझे गाव, माझी प्रगती',
  titleEn: 'My Village, My Progress',
  subtitle: 'ग्रामपंचायत - विकास आणि प्रगतीचा डॅशबोर्ड',
  subtitleEn: 'Gram Panchayat - Development & Progress Dashboard',
  description: '',
  descriptionEn: '',
  highlightText: '',
  highlightTextEn: '',
  isActive: true,
};

const kpiDefaults: KpiFormState = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  value: 0,
  unit: '',
  unitEn: '',
  icon: 'Target',
  color: 'blue',
  order: 0,
  isActive: true,
};

const progressDefaults: ProgressFormState = {
  title: '',
  titleEn: '',
  value: 0,
  unit: '%',
  icon: 'Activity',
  color: 'blue',
  order: 0,
  isActive: true,
};

const statDefaults: ContentStatFormState = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  value: 0,
  unit: '',
  icon: 'FolderOpen',
  color: 'blue',
  order: 0,
  isActive: true,
  breakdown: [],
};

const wardDefaults: WardFormState = {
  name: '',
  nameEn: '',
  population: 0,
  households: 0,
  sanitation: 0,
  waterSupply: 0,
  electricity: 0,
  projects: 0,
  complaints: 0,
  resolvedComplaints: 0,
  order: 0,
  isActive: true,
};

const achievementDefaults: AchievementFormState = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  impact: '',
  impactEn: '',
  category: '',
  categoryEn: '',
  year: '',
  icon: 'Award',
  order: 0,
  isActive: true,
};

const activityDefaults: ActivityFormState = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  activityDate: new Date().toISOString().split('T')[0],
  icon: 'Activity',
  color: 'green',
  order: 0,
  isActive: true,
};

const gradientMap: Record<string, string> = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  orange: 'bg-orange-500 text-white',
  indigo: 'bg-indigo-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  pink: 'bg-pink-500 text-white',
  emerald: 'bg-emerald-500 text-white',
};

const activityColorMap: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

const getActivityClasses = (color: string) => activityColorMap[color] ?? activityColorMap.green;

export default function DashboardMetricsAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [kpis, setKpis] = useState<DashboardKpiMetric[]>([]);
  const [progressIndicators, setProgressIndicators] = useState<DashboardProgressIndicator[]>([]);
  const [contentStats, setContentStats] = useState<DashboardContentStat[]>([]);
  const [wards, setWards] = useState<DashboardWardComparison[]>([]);
  const [achievements, setAchievements] = useState<DashboardAchievement[]>([]);
  const [activities, setActivities] = useState<DashboardRecentActivity[]>([]);

  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [overviewForm, setOverviewForm] = useState<OverviewFormState>(overviewDefaults);

  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<DashboardKpiMetric | null>(null);
  const [kpiForm, setKpiForm] = useState<KpiFormState>(kpiDefaults);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState<DashboardProgressIndicator | null>(null);
  const [progressForm, setProgressForm] = useState<ProgressFormState>(progressDefaults);

  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<DashboardContentStat | null>(null);
  const [statForm, setStatForm] = useState<ContentStatFormState>(statDefaults);

  const [isWardModalOpen, setIsWardModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<DashboardWardComparison | null>(null);
  const [wardForm, setWardForm] = useState<WardFormState>(wardDefaults);

  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<DashboardAchievement | null>(null);
  const [achievementForm, setAchievementForm] = useState<AchievementFormState>(achievementDefaults);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DashboardRecentActivity | null>(null);
  const [activityForm, setActivityForm] = useState<ActivityFormState>(activityDefaults);

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        fetchOverview(),
        fetchKpis(),
        fetchProgressIndicators(),
        fetchContentStats(),
        fetchWards(),
        fetchAchievements(),
        fetchActivities(),
      ]);
      setIsLoading(false);
    };
    load();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/dashboard/overview');
      if (response.ok) {
        const data = await response.json();
        setOverview(data ?? null);
      } else {
        setOverview(null);
      }
    } catch (error) {
      console.error('Error fetching overview:', error);
      toast.error('ओव्हरव्ह्यू माहिती लोड करताना त्रुटी आली');
    }
  };

  const fetchKpis = async () => {
    try {
      const response = await fetch('/api/dashboard/kpis');
      if (response.ok) {
        const data = await response.json();
        setKpis(data);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      toast.error('KPI माहिती लोड करताना त्रुटी आली');
    }
  };

  const fetchProgressIndicators = async () => {
    try {
      const response = await fetch('/api/dashboard/progress');
      if (response.ok) {
        const data = await response.json();
        setProgressIndicators(data);
      }
    } catch (error) {
      console.error('Error fetching progress indicators:', error);
      toast.error('प्रगती निर्देशक लोड करताना त्रुटी आली');
    }
  };

  const fetchContentStats = async () => {
    try {
      const response = await fetch('/api/dashboard/content-stats');
      if (response.ok) {
        const data = await response.json();
        setContentStats(data);
      }
    } catch (error) {
      console.error('Error fetching content stats:', error);
      toast.error('सांख्यिकी माहिती लोड करताना त्रुटी आली');
    }
  };

  const fetchWards = async () => {
    try {
      const response = await fetch('/api/dashboard/wards');
      if (response.ok) {
        const data = await response.json();
        setWards(data);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('वॉर्ड माहिती लोड करताना त्रुटी आली');
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/dashboard/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('उपलब्धी माहिती लोड करताना त्रुटी आली');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/dashboard/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('क्रियाकलाप माहिती लोड करताना त्रुटी आली');
    }
  };

  const handleOverviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = overview?.id ? 'PUT' : 'POST';
      const payload = overview?.id ? { ...overviewForm, id: overview.id } : overviewForm;

      const response = await fetch('/api/dashboard/overview', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save overview');
      }

      await fetchOverview();
      setIsOverviewModalOpen(false);
      toast.success('ओव्हरव्ह्यू माहिती सेव्ह झाली');
    } catch (error) {
      console.error('Error saving overview:', error);
      toast.error('ओव्हरव्ह्यू सेव्ह करताना त्रुटी आली');
    }
  };

  const handleKpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingKpi ? 'PUT' : 'POST';
      const payload = editingKpi ? { ...kpiForm, id: editingKpi.id } : kpiForm;

      const response = await fetch('/api/dashboard/kpis', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save KPI');
      }

      await fetchKpis();
      setIsKpiModalOpen(false);
      setEditingKpi(null);
      setKpiForm(kpiDefaults);
      toast.success(editingKpi ? 'KPI अपडेट झाले' : 'नवीन KPI जोडले');
    } catch (error) {
      console.error('Error saving KPI:', error);
      toast.error('KPI सेव्ह करताना त्रुटी आली');
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProgress ? 'PUT' : 'POST';
      const payload = editingProgress ? { ...progressForm, id: editingProgress.id } : progressForm;

      const response = await fetch('/api/dashboard/progress', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress indicator');
      }

      await fetchProgressIndicators();
      setIsProgressModalOpen(false);
      setEditingProgress(null);
      setProgressForm(progressDefaults);
      toast.success(editingProgress ? 'प्रगती निर्देशक अपडेट' : 'नवीन प्रगती निर्देशक जोडला');
    } catch (error) {
      console.error('Error saving progress indicator:', error);
      toast.error('प्रगती निर्देशक सेव्ह करताना त्रुटी आली');
    }
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStat ? 'PUT' : 'POST';
      const payload = editingStat ? { ...statForm, id: editingStat.id } : statForm;

      const response = await fetch('/api/dashboard/content-stats', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save content stat');
      }

      await fetchContentStats();
      setIsStatModalOpen(false);
      setEditingStat(null);
      setStatForm(statDefaults);
      toast.success(editingStat ? 'सांख्यिकी अपडेट' : 'नवीन सांख्यिकी जोडली');
    } catch (error) {
      console.error('Error saving content stat:', error);
      toast.error('सांख्यिकी सेव्ह करताना त्रुटी आली');
    }
  };

  const handleWardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingWard ? 'PUT' : 'POST';
      const payload = editingWard ? { ...wardForm, id: editingWard.id } : wardForm;

      const response = await fetch('/api/dashboard/wards', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save ward record');
      }

      await fetchWards();
      setIsWardModalOpen(false);
      setEditingWard(null);
      setWardForm(wardDefaults);
      toast.success(editingWard ? 'वॉर्ड माहिती अपडेट' : 'नवीन वॉर्ड जोडला');
    } catch (error) {
      console.error('Error saving ward record:', error);
      toast.error('वॉर्ड माहिती सेव्ह करताना त्रुटी आली');
    }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAchievement ? 'PUT' : 'POST';
      const payload = editingAchievement ? { ...achievementForm, id: editingAchievement.id } : achievementForm;

      const response = await fetch('/api/dashboard/achievements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save achievement');
      }

      await fetchAchievements();
      setIsAchievementModalOpen(false);
      setEditingAchievement(null);
      setAchievementForm(achievementDefaults);
      toast.success(editingAchievement ? 'उपलब्धी अपडेट' : 'नवीन उपलब्धी जोडली');
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error('उपलब्धी सेव्ह करताना त्रुटी आली');
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingActivity ? 'PUT' : 'POST';
      const payload = editingActivity ? { ...activityForm, id: editingActivity.id } : activityForm;

      const response = await fetch('/api/dashboard/activities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save activity');
      }

      await fetchActivities();
      setIsActivityModalOpen(false);
      setEditingActivity(null);
      setActivityForm(activityDefaults);
      toast.success(editingActivity ? 'क्रियाकलाप अपडेट' : 'नवीन क्रियाकलाप जोडला');
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('क्रियाकलाप सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (endpoint: string, id: string, onSuccess: () => void, successMessage: string) => {
    if (!confirm('आपल्याला खात्री आहे का? हे आयटम हटवले जाईल.')) {
      return;
    }

    try {
      const response = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      onSuccess();
      toast.success(successMessage);
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('आयटम हटवताना त्रुटी आली');
    }
  };

  const overviewDisplay = overview ?? getDemoDashboardOverview();
  const kpiDisplay = kpis.length > 0 ? kpis : getDemoDashboardKpis();
  const progressDisplay = progressIndicators.length > 0 ? progressIndicators : getDemoDashboardProgressIndicators();
  const statsDisplay = contentStats.length > 0 ? contentStats : getDemoDashboardContentStats();
  const wardDisplay = wards.length > 0 ? wards : getDemoDashboardWards();
  const achievementDisplay = achievements.length > 0 ? achievements : getDemoDashboardAchievements();
  const activityDisplay = activities.length > 0 ? activities : getDemoDashboardActivities();

  const isOverviewDefault = !overview;
  const isKpiDefault = kpis.length === 0;
  const isProgressDefault = progressIndicators.length === 0;
  const isStatsDefault = contentStats.length === 0;
  const isWardDefault = wards.length === 0;
  const isAchievementDefault = achievements.length === 0;
  const isActivityDefault = activities.length === 0;

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('mr-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return value;
    }
  };

  const renderModal = (
    isOpen: boolean,
    onClose: () => void,
    title: string,
    content: React.ReactNode,
  ) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              <Button variant="ghost" onClick={onClose}>
                बंद करा
              </Button>
            </div>
          </div>
          <div className="px-6 py-6">{content}</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">डॅशबोर्ड – माझे गाव, माझी प्रगती</h1>
        <p className="text-gray-600">
          सार्वजनिक डॅशबोर्डवर दाखवली जाणारी सर्व माहिती येथे व्यवस्थापित करा.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="overview">ओव्हरव्ह्यू</TabsTrigger>
          <TabsTrigger value="kpi">KPI</TabsTrigger>
          <TabsTrigger value="progress">प्रगती निर्देशक</TabsTrigger>
          <TabsTrigger value="stats">सांख्यिकी</TabsTrigger>
          <TabsTrigger value="wards">वॉर्ड तुलना</TabsTrigger>
          <TabsTrigger value="achievements">उपलब्धी</TabsTrigger>
          <TabsTrigger value="activities">क्रियाकलाप</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">डॅशबोर्ड ओव्हरव्ह्यू</h2>
              <p className="text-gray-600">
                शीर्षक आणि उपशीर्षक बदलून आपल्या गावासाठी खास संदेश द्या.
              </p>
            </div>
            <Button
              onClick={() => {
                setOverviewForm(
                  overview
                    ? {
                        title: overview.title,
                        titleEn: overview.titleEn,
                        subtitle: overview.subtitle,
                        subtitleEn: overview.subtitleEn,
                        description: overview.description ?? '',
                        descriptionEn: overview.descriptionEn ?? '',
                        highlightText: overview.highlightText ?? '',
                        highlightTextEn: overview.highlightTextEn ?? '',
                        isActive: overview.isActive ?? true,
                      }
                    : overviewDefaults,
                );
                setIsOverviewModalOpen(true);
              }}
            >
              संपादित करा
            </Button>
          </div>

          {isOverviewDefault && (
            <div className="rounded-lg border border-dashed border-purple-300 bg-purple-50/60 p-4 text-sm text-purple-800">
              अद्याप कोणताही ओव्हरव्ह्यू सेव्ह केलेला नाही. खालील डेमो मजकूर सार्वजनिक पानावर दिसेल.
            </div>
          )}

          <Card>
            <CardHeader>
              <p className="text-sm text-gray-500">{overviewDisplay.subtitle}</p>
              <CardTitle className="text-3xl font-bold">{overviewDisplay.title}</CardTitle>
              <p className="text-gray-600">{overviewDisplay.subtitleEn}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {overviewDisplay.description && (
                <p className="text-gray-700">{overviewDisplay.description}</p>
              )}
              {overviewDisplay.highlightText && (
                <div className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-white">
                  {overviewDisplay.highlightText}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPI Tab */}
        <TabsContent value="kpi" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">मुख्य निर्देशक (KPI)</h2>
              <p className="text-gray-600">लोकसंख्या, साक्षरता, पाणी, वीज इत्यादी निर्देशक व्यवस्थापित करा.</p>
            </div>
            <Button
              onClick={() => {
                setEditingKpi(null);
                setKpiForm(kpiDefaults);
                setIsKpiModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन KPI
            </Button>
          </div>

          {isKpiDefault && (
            <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50/70 p-4 text-sm text-blue-800">
              हे डेमो KPI आहेत. तुमचे KPI जोडताच सार्वजनिक पानावर त्वरित अपडेट होईल.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {kpiDisplay.map((metric) => (
              <Card key={metric.id} className="hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{metric.title}</CardTitle>
                      <p className="text-sm text-gray-500">{metric.titleEn}</p>
                    </div>
                    <Badge variant={metric.isActive ? 'default' : 'secondary'}>
                      {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-3 ${gradientMap[metric.color] ?? 'bg-gray-200'}`}>
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        {metric.unit === '%' ? `${metric.value}%` : metric.value.toLocaleString('en-IN')}
                      </div>
                      <p className="text-sm text-gray-500">{metric.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isKpiDefault && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingKpi(metric);
                            setKpiForm({
                              title: metric.title,
                              titleEn: metric.titleEn,
                              description: metric.description,
                              descriptionEn: metric.descriptionEn,
                              value: metric.value,
                              unit: metric.unit ?? '',
                              unitEn: metric.unitEn ?? '',
                              icon: metric.icon,
                              color: metric.color,
                              order: metric.order ?? 0,
                              isActive: metric.isActive ?? true,
                            });
                            setIsKpiModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete('/api/dashboard/kpis', metric.id, fetchKpis, 'KPI हटवला')
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {isKpiDefault && (
                      <p className="text-xs text-gray-500">डेमो KPI - संपादन करण्यासाठी स्वतःचा KPI जोडा</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">प्रगती निर्देशक</h2>
              <p className="text-gray-600">डिजिटल साक्षरता, महिला सहभाग इत्यादी निर्देशक व्यवस्थापित करा.</p>
            </div>
            <Button
              onClick={() => {
                setEditingProgress(null);
                setProgressForm(progressDefaults);
                setIsProgressModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन निर्देशक
            </Button>
          </div>

          {isProgressDefault && (
            <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/70 p-4 text-sm text-amber-800">
              हे डेमो निर्देशक आहेत. तुमचे डेटा जोडल्यावर येथे दिसेल.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {progressDisplay.map((indicator) => (
              <Card key={indicator.id} className="hover:shadow-lg">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{indicator.title}</h3>
                      <p className="text-sm text-gray-500">{indicator.titleEn}</p>
                    </div>
                    <Badge variant={indicator.isActive ? 'default' : 'secondary'}>
                      {indicator.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>प्रगती</span>
                      <span>{indicator.value}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{ width: `${Math.min(indicator.value, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isProgressDefault ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingProgress(indicator);
                            setProgressForm({
                              title: indicator.title,
                              titleEn: indicator.titleEn,
                              value: indicator.value,
                              unit: indicator.unit ?? '%',
                              icon: indicator.icon,
                              color: indicator.color,
                              order: indicator.order ?? 0,
                              isActive: indicator.isActive ?? true,
                            });
                            setIsProgressModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete('/api/dashboard/progress', indicator.id, fetchProgressIndicators, 'प्रगती निर्देशक हटवला')
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 text-center">डेमो निर्देशक</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Stats */}
        <TabsContent value="stats" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">सामग्री सांख्यिकी</h2>
              <p className="text-gray-600">प्रकल्प, घोषणा, तक्रारी इत्यादी सांख्यिकी व्यवस्थापित करा.</p>
            </div>
            <Button
              onClick={() => {
                setEditingStat(null);
                setStatForm(statDefaults);
                setIsStatModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन सांख्यिकी
            </Button>
          </div>

          {isStatsDefault && (
            <div className="rounded-lg border border-dashed border-green-300 bg-green-50/70 p-4 text-sm text-green-800">
              डेमो सांख्यिकी दिसत आहेत. तुम्ही स्वतःची सांख्यिकी जोडू शकता.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsDisplay.map((stat) => (
              <Card key={stat.id} className="hover:shadow-lg">
                <CardContent className="space-y-3 pt-6">
                  <div className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString('en-IN')}</div>
                  <div className="text-sm font-medium text-gray-700">{stat.title}</div>
                  <p className="text-xs text-gray-500">{stat.description}</p>

                  {stat.breakdown && (
                    <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                      {stat.breakdown.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {!isStatsDefault ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingStat(stat);
                            setStatForm({
                              title: stat.title,
                              titleEn: stat.titleEn,
                              description: stat.description ?? '',
                              descriptionEn: stat.descriptionEn ?? '',
                              value: stat.value,
                              unit: stat.unit ?? '',
                              icon: stat.icon ?? 'FolderOpen',
                              color: stat.color ?? 'blue',
                              order: stat.order ?? 0,
                              isActive: stat.isActive ?? true,
                              breakdown: Array.isArray(stat.breakdown) ? stat.breakdown : [],
                            });
                            setIsStatModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete('/api/dashboard/content-stats', stat.id, fetchContentStats, 'सांख्यिकी हटवली')
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 text-center">डेमो सांख्यिकी</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wards */}
        <TabsContent value="wards" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">वॉर्डनिहाय तुलना</h2>
              <p className="text-gray-600">लोकसंख्या, सुविधा व तक्रारी यांची तुलना करा.</p>
            </div>
            <Button
              onClick={() => {
                setEditingWard(null);
                setWardForm(wardDefaults);
                setIsWardModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन वॉर्ड
            </Button>
          </div>

          {isWardDefault && (
            <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/70 p-4 text-sm text-orange-800">
              डेमो वॉर्ड माहिती दिसत आहे. स्वतःची माहिती सेव्ह करा.
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['वॉर्ड', 'लोकसंख्या', 'घरे', 'स्वच्छता', 'पाणी', 'वीज', 'प्रकल्प', 'तक्रारी'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left font-medium text-gray-600">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {wardDisplay.map((ward) => (
                  <tr key={ward.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{ward.name}</div>
                      <div className="text-xs text-gray-500">{ward.nameEn}</div>
                    </td>
                    <td className="px-4 py-3">{ward.population.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{ward.households}</td>
                    <td className="px-4 py-3">{ward.sanitation}%</td>
                    <td className="px-4 py-3">{ward.waterSupply}%</td>
                    <td className="px-4 py-3">{ward.electricity}%</td>
                    <td className="px-4 py-3">{ward.projects}</td>
                    <td className="px-4 py-3">
                      <div>{ward.complaints}</div>
                      <div className="text-xs text-green-600">सोडविले: {ward.resolvedComplaints}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isWardDefault ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingWard(ward);
                              setWardForm({
                                name: ward.name,
                                nameEn: ward.nameEn,
                                population: ward.population,
                                households: ward.households,
                                sanitation: ward.sanitation,
                                waterSupply: ward.waterSupply,
                                electricity: ward.electricity,
                                projects: ward.projects,
                                complaints: ward.complaints,
                                resolvedComplaints: ward.resolvedComplaints,
                                order: ward.order ?? 0,
                                isActive: ward.isActive ?? true,
                              });
                              setIsWardModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() =>
                              handleDelete('/api/dashboard/wards', ward.id, fetchWards, 'वॉर्ड माहिती हटवली')
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">डेमो</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">वर्षातील टॉप उपलब्धी</h2>
              <p className="text-gray-600">गावाच्या महत्त्वाच्या उपलब्धी आणि परिणाम व्यवस्थापित करा.</p>
            </div>
            <Button
              onClick={() => {
                setEditingAchievement(null);
                setAchievementForm(achievementDefaults);
                setIsAchievementModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन उपलब्धी
            </Button>
          </div>

          {isAchievementDefault && (
            <div className="rounded-lg border border-dashed border-rose-300 bg-rose-50/70 p-4 text-sm text-rose-800">
              डेमो उपलब्धी दिसत आहेत. स्वतःच्या उपलब्धी जोडून अपडेट करा.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievementDisplay.map((achievement, index) => (
              <Card key={achievement.id} className="relative hover:shadow-lg">
                <div className="absolute right-4 top-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                  #{index + 1}
                </div>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-50 p-3">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-xs text-gray-500">{achievement.titleEn}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">परिणाम:</p>
                    <p className="text-sm text-green-600">{achievement.impact}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">
                      {achievement.category}
                    </span>
                    <span>{achievement.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isAchievementDefault ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingAchievement(achievement);
                            setAchievementForm({
                              title: achievement.title,
                              titleEn: achievement.titleEn,
                              description: achievement.description,
                              descriptionEn: achievement.descriptionEn,
                              impact: achievement.impact,
                              impactEn: achievement.impactEn,
                              category: achievement.category,
                              categoryEn: achievement.categoryEn,
                              year: achievement.year,
                              icon: achievement.icon,
                              order: achievement.order ?? 0,
                              isActive: achievement.isActive ?? true,
                            });
                            setIsAchievementModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete('/api/dashboard/achievements', achievement.id, fetchAchievements, 'उपलब्धी हटवली')
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 text-center">डेमो उपलब्धी</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activities */}
        <TabsContent value="activities" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">अलीकडील क्रियाकलाप</h2>
              <p className="text-gray-600">ग्रामसभा, घोषणा व प्रकल्पांच्या माहितीचे अपडेट.</p>
            </div>
            <Button
              onClick={() => {
                setEditingActivity(null);
                setActivityForm(activityDefaults);
                setIsActivityModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन नोंद
            </Button>
          </div>

          {isActivityDefault && (
            <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50/70 p-4 text-sm text-indigo-800">
              डेमो क्रियाकलाप दिसत आहेत. स्वतःचे क्रियाकलाप अपडेट करा.
            </div>
          )}

          <div className="space-y-4">
            {activityDisplay.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
              >
                {(() => {
                  const colorClasses = getActivityClasses(activity.color);
                  return (
                    <div className={`rounded-xl p-3 ${colorClasses.bg} ${colorClasses.text}`}>
                      {activity.icon === 'CheckCircle' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : activity.icon === 'Clock' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {formatDate(activity.activityDate)}
                </div>
                {!isActivityDefault ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingActivity(activity);
                        setActivityForm({
                          title: activity.title,
                          titleEn: activity.titleEn,
                          description: activity.description,
                          descriptionEn: activity.descriptionEn,
                          activityDate: activity.activityDate.split('T')[0],
                          icon: activity.icon,
                          color: activity.color,
                          order: activity.order ?? 0,
                          isActive: activity.isActive ?? true,
                        });
                        setIsActivityModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() =>
                        handleDelete('/api/dashboard/activities', activity.id, fetchActivities, 'क्रियाकलाप हटवला')
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">डेमो</span>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Overview Modal */}
      {renderModal(
        isOverviewModalOpen,
        () => setIsOverviewModalOpen(false),
        'ओव्हरव्ह्यू संपादित करा',
        <form onSubmit={handleOverviewSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={overviewForm.title}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={overviewForm.titleEn}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">उपशीर्षक (मराठी)</label>
              <Input
                value={overviewForm.subtitle}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Subtitle (English)</label>
              <Input
                value={overviewForm.subtitleEn}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, subtitleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्णन (मराठी)</label>
              <Textarea
                rows={3}
                value={overviewForm.description}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (English)</label>
              <Textarea
                rows={3}
                value={overviewForm.descriptionEn}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">हायलाइट (मराठी)</label>
              <Textarea
                rows={3}
                value={overviewForm.highlightText}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, highlightText: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Highlight (English)</label>
              <Textarea
                rows={3}
                value={overviewForm.highlightTextEn}
                onChange={(e) => setOverviewForm((prev) => ({ ...prev, highlightTextEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={overviewForm.isActive}
              onChange={(e) => setOverviewForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">सक्रिय</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOverviewModalOpen(false)}>
              रद्द करा
            </Button>
            <Button type="submit">साठवा</Button>
          </div>
        </form>,
      )}

      {/* KPI Modal */}
      {renderModal(
        isKpiModalOpen,
        () => {
          setIsKpiModalOpen(false);
          setEditingKpi(null);
        },
        editingKpi ? 'KPI संपादित करा' : 'नवीन KPI जोडा',
        <form onSubmit={handleKpiSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={kpiForm.title}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={kpiForm.titleEn}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्णन (मराठी)</label>
              <Textarea
                rows={2}
                value={kpiForm.description}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (English)</label>
              <Textarea
                rows={2}
                value={kpiForm.descriptionEn}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Value</label>
              <Input
                type="number"
                value={kpiForm.value}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Unit (मराठी)</label>
              <Input
                value={kpiForm.unit}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Unit (English)</label>
              <Input
                value={kpiForm.unitEn}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, unitEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={kpiForm.icon}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, icon: e.target.value }))}
              >
                {['Target', 'Users', 'Droplets', 'Zap', 'TrendingUp', 'Activity', 'TreePine'].map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Color</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={kpiForm.color}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, color: e.target.value }))}
              >
                {['blue', 'green', 'purple', 'orange', 'yellow', 'indigo', 'emerald'].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={kpiForm.order}
                onChange={(e) => setKpiForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={kpiForm.isActive}
              onChange={(e) => setKpiForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">सक्रिय</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsKpiModalOpen(false);
                setEditingKpi(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingKpi ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}

      {/* Progress Modal */}
      {renderModal(
        isProgressModalOpen,
        () => {
          setIsProgressModalOpen(false);
          setEditingProgress(null);
        },
        editingProgress ? 'प्रगती निर्देशक संपादित करा' : 'नवीन प्रगती निर्देशक जोडा',
        <form onSubmit={handleProgressSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={progressForm.title}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={progressForm.titleEn}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Value</label>
              <Input
                type="number"
                value={progressForm.value}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <Input
                value={progressForm.unit}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={progressForm.order}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={progressForm.icon}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, icon: e.target.value }))}
              >
                {['Activity', 'Users', 'Target', 'TrendingUp', 'TreePine', 'Heart'].map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Color</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={progressForm.color}
                onChange={(e) => setProgressForm((prev) => ({ ...prev, color: e.target.value }))}
              >
                {['blue', 'purple', 'pink', 'green', 'orange', 'indigo'].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={progressForm.isActive}
              onChange={(e) => setProgressForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">सक्रिय</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsProgressModalOpen(false);
                setEditingProgress(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingProgress ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}

      {/* Content Stat Modal */}
      {renderModal(
        isStatModalOpen,
        () => {
          setIsStatModalOpen(false);
          setEditingStat(null);
        },
        editingStat ? 'सांख्यिकी संपादित करा' : 'नवीन सांख्यिकी जोडा',
        <form onSubmit={handleStatSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={statForm.title}
                onChange={(e) => setStatForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={statForm.titleEn}
                onChange={(e) => setStatForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्णन (मराठी)</label>
              <Textarea
                rows={2}
                value={statForm.description}
                onChange={(e) => setStatForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (English)</label>
              <Textarea
                rows={2}
                value={statForm.descriptionEn}
                onChange={(e) => setStatForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Value</label>
              <Input
                type="number"
                value={statForm.value}
                onChange={(e) => setStatForm((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <Input
                value={statForm.unit}
                onChange={(e) => setStatForm((prev) => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={statForm.order}
                onChange={(e) => setStatForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <Input
                value={statForm.icon}
                onChange={(e) => setStatForm((prev) => ({ ...prev, icon: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Color</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={statForm.color}
                onChange={(e) => setStatForm((prev) => ({ ...prev, color: e.target.value }))}
              >
                {['blue', 'green', 'purple', 'orange', 'yellow', 'indigo', 'pink'].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Breakdown (ऐच्छिक)</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setStatForm((prev) => ({
                    ...prev,
                    breakdown: [...prev.breakdown, { label: '', labelEn: '', value: 0 }],
                  }))
                }
              >
                + जोडा
              </Button>
            </div>
            <div className="space-y-3">
              {statForm.breakdown.map((item, index) => (
                <div key={`breakdown-${index}`} className="grid grid-cols-1 gap-2 rounded-lg border p-3 md:grid-cols-4">
                  <Input
                    placeholder="Label (मराठी)"
                    value={item.label}
                    onChange={(e) =>
                      setStatForm((prev) => {
                        const updated = [...prev.breakdown];
                        updated[index] = { ...updated[index], label: e.target.value };
                        return { ...prev, breakdown: updated };
                      })
                    }
                  />
                  <Input
                    placeholder="Label (English)"
                    value={item.labelEn ?? ''}
                    onChange={(e) =>
                      setStatForm((prev) => {
                        const updated = [...prev.breakdown];
                        updated[index] = { ...updated[index], labelEn: e.target.value };
                        return { ...prev, breakdown: updated };
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) =>
                      setStatForm((prev) => {
                        const updated = [...prev.breakdown];
                        updated[index] = { ...updated[index], value: parseFloat(e.target.value) || 0 };
                        return { ...prev, breakdown: updated };
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() =>
                      setStatForm((prev) => ({
                        ...prev,
                        breakdown: prev.breakdown.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    काढा
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={statForm.isActive}
              onChange={(e) => setStatForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">सक्रिय</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsStatModalOpen(false);
                setEditingStat(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingStat ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}

      {/* Ward Modal */}
      {renderModal(
        isWardModalOpen,
        () => {
          setIsWardModalOpen(false);
          setEditingWard(null);
        },
        editingWard ? 'वॉर्ड माहिती संपादित करा' : 'नवीन वॉर्ड माहिती जोडा',
        <form onSubmit={handleWardSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वॉर्ड नाव (मराठी)</label>
              <Input
                value={wardForm.name}
                onChange={(e) => setWardForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ward Name (English)</label>
              <Input
                value={wardForm.nameEn}
                onChange={(e) => setWardForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">लोकसंख्या</label>
              <Input
                type="number"
                value={wardForm.population}
                onChange={(e) => setWardForm((prev) => ({ ...prev, population: parseInt(e.target.value, 10) || 0 }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">घरे</label>
              <Input
                type="number"
                value={wardForm.households}
                onChange={(e) => setWardForm((prev) => ({ ...prev, households: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={wardForm.order}
                onChange={(e) => setWardForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">स्वच्छता (%)</label>
              <Input
                type="number"
                value={wardForm.sanitation}
                onChange={(e) => setWardForm((prev) => ({ ...prev, sanitation: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">पाणी (%)</label>
              <Input
                type="number"
                value={wardForm.waterSupply}
                onChange={(e) => setWardForm((prev) => ({ ...prev, waterSupply: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">वीज (%)</label>
              <Input
                type="number"
                value={wardForm.electricity}
                onChange={(e) => setWardForm((prev) => ({ ...prev, electricity: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">प्रकल्प</label>
              <Input
                type="number"
                value={wardForm.projects}
                onChange={(e) => setWardForm((prev) => ({ ...prev, projects: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">तक्रारी</label>
              <Input
                type="number"
                value={wardForm.complaints}
                onChange={(e) => setWardForm((prev) => ({ ...prev, complaints: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">सोडविलेले</label>
              <Input
                type="number"
                value={wardForm.resolvedComplaints}
                onChange={(e) =>
                  setWardForm((prev) => ({ ...prev, resolvedComplaints: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wardForm.isActive}
              onChange={(e) => setWardForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">सक्रिय</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsWardModalOpen(false);
                setEditingWard(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingWard ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}

      {/* Achievement Modal */}
      {renderModal(
        isAchievementModalOpen,
        () => {
          setIsAchievementModalOpen(false);
          setEditingAchievement(null);
        },
        editingAchievement ? 'उपलब्धी संपादित करा' : 'नवीन उपलब्धी जोडा',
        <form onSubmit={handleAchievementSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={achievementForm.title}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={achievementForm.titleEn}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्णन (मराठी)</label>
              <Textarea
                rows={2}
                value={achievementForm.description}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (English)</label>
              <Textarea
                rows={2}
                value={achievementForm.descriptionEn}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">परिणाम (मराठी)</label>
              <Textarea
                rows={2}
                value={achievementForm.impact}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, impact: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Impact (English)</label>
              <Textarea
                rows={2}
                value={achievementForm.impactEn}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, impactEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्ग (मराठी)</label>
              <Input
                value={achievementForm.category}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category (English)</label>
              <Input
                value={achievementForm.categoryEn}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, categoryEn: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Year</label>
              <Input
                value={achievementForm.year}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, year: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <Input
                value={achievementForm.icon}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, icon: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={achievementForm.order}
                onChange={(e) =>
                  setAchievementForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={achievementForm.isActive}
                onChange={(e) => setAchievementForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
              <span className="text-sm text-gray-700">सक्रिय</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAchievementModalOpen(false);
                setEditingAchievement(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingAchievement ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}

      {/* Activity Modal */}
      {renderModal(
        isActivityModalOpen,
        () => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        },
        editingActivity ? 'क्रियाकलाप संपादित करा' : 'नवीन क्रियाकलाप जोडा',
        <form onSubmit={handleActivitySubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">शीर्षक (मराठी)</label>
              <Input
                value={activityForm.title}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title (English)</label>
              <Input
                value={activityForm.titleEn}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">वर्णन (मराठी)</label>
              <Textarea
                rows={2}
                value={activityForm.description}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description (English)</label>
              <Textarea
                rows={2}
                value={activityForm.descriptionEn}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">तारीख</label>
              <Input
                type="date"
                value={activityForm.activityDate}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, activityDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <Input
                value={activityForm.icon}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, icon: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Color</label>
              <Input
                value={activityForm.color}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">क्रम</label>
              <Input
                type="number"
                value={activityForm.order}
                onChange={(e) =>
                  setActivityForm((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={activityForm.isActive}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
              <span className="text-sm text-gray-700">सक्रिय</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsActivityModalOpen(false);
                setEditingActivity(null);
              }}
            >
              रद्द करा
            </Button>
            <Button type="submit">{editingActivity ? 'अपडेट' : 'जोडा'}</Button>
          </div>
        </form>,
      )}
    </div>
  );
}
