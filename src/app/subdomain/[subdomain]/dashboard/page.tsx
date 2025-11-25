import { prisma } from '@/lib/prisma';
import { SubdomainValidator } from '@/components/subdomain-validator';
import {
  Users,
  GraduationCap,
  Droplets,
  Zap,
  TreePine,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Calendar,
  Sun,
} from 'lucide-react';
import {
  getDemoDashboardActivities,
  getDemoDashboardAchievements,
  getDemoDashboardContentStats,
  getDemoDashboardKpis,
  getDemoDashboardOverview,
  getDemoDashboardProgressIndicators,
  getDemoDashboardWards,
} from '@/lib/demo-dashboard-data';

interface DashboardPageProps {
  params: Promise<{ subdomain: string }>;
}

const iconMap = {
  Users,
  GraduationCap,
  Droplets,
  Zap,
  TreePine,
  TrendingUp,
  CheckCircle,
  Activity,
  Target,
  BarChart3,
};

const getIconComponent = (name: string) => iconMap[name as keyof typeof iconMap] ?? BarChart3;

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    emerald: 'bg-emerald-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
    pink: 'bg-pink-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    cyan: 'bg-cyan-500 text-white',
  };
  return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
};

const textColorMap: Record<string, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  yellow: 'text-yellow-600',
  indigo: 'text-indigo-600',
  pink: 'text-pink-600',
};

const getTextColor = (color?: string) => textColorMap[color ?? 'blue'] ?? 'text-blue-600';

const getProgressColor = (value: number) => {
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-yellow-500';
  if (value >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const parseBreakdown = (breakdown: unknown) => {
  if (!Array.isArray(breakdown)) return [];
  return breakdown.filter(
    (item) => typeof item === 'object' && item !== null && 'label' in item && 'value' in item,
  ) as Array<{ label: string; value: number }>;
};

const toDateInput = (value: string | Date | null | undefined) =>
  value instanceof Date ? value.toISOString() : value ?? '';

const getRelativeTime = (dateString: string) => {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'आज';
    if (days === 1) return '1 दिवसांपूर्वी';
    if (days < 7) return `${days} दिवसांपूर्वी`;
    const weeks = Math.round(days / 7);
    return `${weeks} आठवड्यांपूर्वी`;
  } catch {
    return '';
  }
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { subdomain } = await params;

  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
    },
  });

  if (!subdomainData) {
    return <div>Subdomain not found</div>;
  }

  const [
    overviewRecord,
    kpiMetrics,
    progressIndicators,
    contentStats,
    wardComparisons,
    achievements,
    recentActivities,
  ] = await Promise.all([
    prisma.dashboardOverview.findFirst({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.dashboardKpiMetric.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.dashboardProgressIndicator.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.dashboardContentStat.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.dashboardWardComparison.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.dashboardAchievement.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.dashboardRecentActivity.findMany({
      where: { subdomainId: subdomainData.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  const overviewDisplay = overviewRecord ?? getDemoDashboardOverview();
  const kpiCards = kpiMetrics.length > 0 ? kpiMetrics : getDemoDashboardKpis();
  const progressCards = progressIndicators.length > 0 ? progressIndicators : getDemoDashboardProgressIndicators();
  const statsCards = contentStats.length > 0 ? contentStats : getDemoDashboardContentStats();
  const wards = wardComparisons.length > 0 ? wardComparisons : getDemoDashboardWards();
  const topAchievements = achievements.length > 0 ? achievements : getDemoDashboardAchievements();
  const activityFeed = (recentActivities.length > 0 ? recentActivities : getDemoDashboardActivities()).map((item) => ({
    ...item,
    relative: getRelativeTime(toDateInput(item.activityDate)),
  }));

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-600 to-teal-700 py-16 text-white">
          <div className="container">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">{overviewDisplay.title || 'माझे गाव, माझी प्रगती'}</h1>
              <p className="mx-auto max-w-3xl text-xl text-green-100">
                {subdomainData.villageName} ग्रामपंचायत - {overviewDisplay.subtitle || 'विकास आणि प्रगतीचा डॅशबोर्ड'}
              </p>
              <p className="mt-2 text-lg text-green-200">
                {overviewDisplay.subtitleEn || 'My Village, My Progress'} - {subdomainData.villageNameEn} Gram Panchayat
                Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <BarChart3 className="h-6 w-6 text-green-600" />
              मुख्य निर्देशक (Key Performance Indicators)
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {kpiCards.map((kpi) => {
                const Icon = getIconComponent(kpi.icon);
                return (
                  <div key={kpi.id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`rounded-lg p-3 ${getColorClasses(kpi.color)}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {kpi.unit === '%' || kpi.value.toString().includes('%')
                            ? `${kpi.value}${kpi.unit ?? ''}`
                            : Number(kpi.value).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">{kpi.titleEn}</div>
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{kpi.title}</h3>
                    <p className="text-sm text-gray-600">{kpi.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <PieChart className="h-6 w-6 text-blue-600" />
              प्रगती निर्देशक (Progress Indicators)
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {progressCards.map((progress) => {
                const Icon = getIconComponent(progress.icon);
                return (
                  <div key={progress.id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${getColorClasses(progress.color)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{progress.title}</h3>
                        <p className="text-sm text-gray-600">{progress.titleEn}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm text-gray-600">
                        <span>प्रगती</span>
                        <span>
                          {progress.value}
                          {progress.unit ?? '%'}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(progress.value)}`}
                          style={{ width: `${Math.min(progress.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Award className="h-6 w-6 text-purple-600" />
              सामग्री सांख्यिकी (Content Statistics)
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat) => (
                <div key={stat.id} className="rounded-lg bg-white p-6 text-center shadow-md">
                  <div className={`mb-2 text-3xl font-bold ${getTextColor(stat.color as string)}`}>
                    {stat.value.toLocaleString('en-IN')}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">{stat.title}</div>
                  <div className="text-xs text-gray-500">{stat.titleEn}</div>
                  {parseBreakdown(stat.breakdown).length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                      {parseBreakdown(stat.breakdown).map((item) => (
                        <span key={`${stat.id}-${item.label}`} className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                          {item.label}: {item.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              वॉर्डनिहाय तुलना (Ward-wise Comparison)
            </h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['वॉर्ड', 'लोकसंख्या', 'घरे', 'स्वच्छता', 'पाणी', 'वीज', 'प्रकल्प', 'तक्रारी'].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {wards.map((ward) => (
                      <tr key={ward.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{ward.name}</div>
                          <div className="text-sm text-gray-500">{ward.nameEn}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{ward.population.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{ward.households}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: `${ward.sanitation}%` }} />
                            </div>
                            <span className="text-sm text-gray-900">{ward.sanitation}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${ward.waterSupply}%` }} />
                            </div>
                            <span className="text-sm text-gray-900">{ward.waterSupply}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                              <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${ward.electricity}%` }} />
                            </div>
                            <span className="text-sm text-gray-900">{ward.electricity}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{ward.projects}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{ward.complaints}</div>
                          <div className="text-xs text-green-600">सोडविले: {ward.resolvedComplaints}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Award className="h-6 w-6 text-yellow-600" />
              वर्षातील टॉप ५ उपलब्धी (Top 5 Achievements of the Year)
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topAchievements.map((achievement, index) => (
                <div key={achievement.id} className="relative rounded-lg bg-white p-6 shadow-md">
                  <div className="absolute right-4 top-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                      <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                    </div>
                  </div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                        {achievement.icon === 'TreePine' ? (
                          <TreePine className="h-6 w-6 text-yellow-600" />
                        ) : achievement.icon === 'Users' ? (
                          <Users className="h-6 w-6 text-yellow-600" />
                        ) : achievement.icon === 'Sun' ? (
                          <Sun className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.titleEn}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-700">{achievement.description}</p>
                  <div className="mb-4">
                    <h4 className="mb-1 text-sm font-medium text-gray-900">परिणाम:</h4>
                    <p className="text-sm text-green-600">{achievement.impact}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">{achievement.category}</span>
                    <span className="text-gray-500">{achievement.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="h-6 w-6 text-indigo-600" />
              अलीकडील क्रियाकलाप (Recent Activity)
            </h2>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      activity.color === 'blue'
                        ? 'bg-blue-50'
                        : activity.color === 'yellow'
                          ? 'bg-yellow-50'
                          : 'bg-green-50'
                    }`}
                  >
                    {activity.icon === 'Clock' ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : activity.icon === 'AlertCircle' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">{activity.relative}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubdomainValidator>
  );
}
