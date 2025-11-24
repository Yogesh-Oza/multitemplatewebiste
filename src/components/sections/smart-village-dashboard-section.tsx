'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Gauge,
  Activity,
  Zap,
  Droplets,
  Wifi,
  Sun,
  Cloud,
  CloudRain,
  Leaf,
  Shield,
  Building2,
  MapPin,
  Thermometer,
  Waves,
  Cpu,
  BarChart3,
  Download
} from 'lucide-react';
import {
  DEMO_INFRASTRUCTURE_FACILITIES,
  DEMO_SMART_VILLAGE_METRICS,
  DEMO_SERVICE_STATUS_ITEMS
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
  lastUpdated?: string | null;
  isActive: boolean;
  order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplet: Droplets,
  MapPin,
  Gauge,
  Shield,
  Leaf,
  Building: Building2
};

const metricIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  electricity: Zap,
  water: Droplets,
  internet: Wifi,
  weather: Sun,
  default: Gauge
};

const weatherLabelMap: Record<string, string> = {
  sunny: 'सूर्यप्रकाश',
  cloudy: 'ढगाळ',
  rainy: 'पावसाळी',
  stormy: 'वादळी'
};

const statusColorMap: Record<string, string> = {
  चालू: 'bg-green-100 text-green-700',
  उपलब्ध: 'bg-green-100 text-green-700',
  जोडले: 'bg-green-100 text-green-700',
  देखभाल: 'bg-yellow-100 text-yellow-700',
  बंद: 'bg-red-100 text-red-700',
  अनुपलब्ध: 'bg-red-100 text-red-700'
};

export default function SmartVillageDashboardSection() {
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>(
    DEMO_INFRASTRUCTURE_FACILITIES as InfrastructureFacility[]
  );
  const [metrics, setMetrics] = useState<SmartVillageMetric[]>(
    DEMO_SMART_VILLAGE_METRICS as SmartVillageMetric[]
  );
  const [services, setServices] = useState<ServiceStatusItem[]>(
    DEMO_SERVICE_STATUS_ITEMS as ServiceStatusItem[]
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [facRes, metRes, servRes] = await Promise.allSettled([
          fetch('/api/infrastructure-facilities'),
          fetch('/api/smart-village-metrics'),
          fetch('/api/service-status-items')
        ]);

        if (facRes.status === 'fulfilled' && facRes.value.ok) {
          const data = await facRes.value.json();
          if (Array.isArray(data) && data.length > 0) {
            setFacilities(data.filter((item: InfrastructureFacility) => item.isActive));
          }
        }

        if (metRes.status === 'fulfilled' && metRes.value.ok) {
          const data = await metRes.value.json();
          if (Array.isArray(data) && data.length > 0) {
            setMetrics(data.filter((item: SmartVillageMetric) => item.isActive));
          }
        }

        if (servRes.status === 'fulfilled' && servRes.value.ok) {
          const data = await servRes.value.json();
          if (Array.isArray(data) && data.length > 0) {
            setServices(data.filter((item: ServiceStatusItem) => item.isActive));
          }
        }
      } catch (error) {
        console.error('Failed to load smart village data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const allDates: string[] = [];
    metrics.forEach((metric) => {
      if (metric.lastUpdated) allDates.push(metric.lastUpdated);
    });
    services.forEach((service) => {
      if (service.lastUpdated) allDates.push(service.lastUpdated);
    });
    if (allDates.length > 0) {
      const latest = allDates.reduce((latestDate, current) =>
        new Date(current) > new Date(latestDate) ? current : latestDate
      );
      setLastUpdated(latest);
    } else {
      setLastUpdated(null);
    }
  }, [metrics, services]);

  const highlightedMetrics = useMemo(() => {
    const byType: Record<string, SmartVillageMetric> = {};
    metrics.forEach((metric) => {
      if (!byType[metric.type]) {
        byType[metric.type] = metric;
      }
    });
    return ['electricity', 'water', 'internet', 'weather'].map(
      (key) => byType[key] || null
    );
  }, [metrics]);

  const getStatusBadge = (status: string) => {
    const color =
      statusColorMap[status] || (statusColorMap['चालू'] as string);
    return <Badge className={color}>{status}</Badge>;
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('mr-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMetricDetails = (metric: SmartVillageMetric | null) => {
    if (!metric) return null;

    const metadataEntries =
      metric.metadata && Object.entries(metric.metadata).length > 0
        ? Object.entries(metric.metadata)
        : null;

    return (
      <div className="space-y-2 text-sm">
        {metric.supplyHours !== null && metric.supplyHours !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">पुरवठा तास:</span>
            <span className="font-semibold">{metric.supplyHours} तास</span>
          </div>
        )}
        {metric.quality && (
          <div className="flex justify-between">
            <span className="text-gray-600">गुणवत्ता:</span>
            <span className="font-semibold">{metric.quality}</span>
          </div>
        )}
        {metric.usage && (
          <div className="flex justify-between">
            <span className="text-gray-600">वापर:</span>
            <span className="font-semibold">{metric.usage}</span>
          </div>
        )}
        {metric.pressure && (
          <div className="flex justify-between">
            <span className="text-gray-600">दाब:</span>
            <span className="font-semibold">{metric.pressure}</span>
          </div>
        )}
        {metadataEntries &&
          metadataEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key}:</span>
              <span className="font-semibold">{String(value)}</span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <section className="space-y-10">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-blue-100">
            <Gauge className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              स्मार्ट व्हिलेज डॅशबोर्ड
            </h2>
            <p className="text-lg text-gray-600">
              Smart Village Dashboard
            </p>
          </div>
        </div>
        <p className="text-gray-500 max-w-3xl mx-auto">
          दररोजचा वीजपुरवठा, पाण्याची उपलब्धता आणि इतर सुविधांची रियल-टाइम माहिती
        </p>
        <p className="text-sm text-gray-500">
          रियल-टाइम स्थिती • अद्यतन: {lastUpdated ? formatDate(lastUpdated) : 'थेट डेटा'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilities
          .sort((a, b) => a.order - b.order)
          .slice(0, 4)
          .map((facility) => {
            const IconComponent =
              iconMap[facility.icon as keyof typeof iconMap] || Building2;
            return (
              <Card key={facility.id} className="border-0 shadow-md">
                <CardHeader className="flex flex-col items-start gap-3">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{facility.title}</CardTitle>
                    <p className="text-sm text-gray-500">{facility.titleEn}</p>
                  </div>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>{facility.description}</p>
                  <p className="text-sm text-gray-500 mt-2">{facility.descriptionEn}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-600" />
            रियल-टाइम स्थिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlightedMetrics.map((metric, index) => {
                if (!metric) return (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-dashed border-gray-200 text-center text-gray-400">
                    डेटा उपलब्ध नाही
                  </div>
                );
                const IconComponent =
                  metricIconMap[metric.type as keyof typeof metricIconMap] ||
                  metricIconMap.default;
                return (
                  <div key={metric.id} className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{metric.title}</p>
                          <p className="text-xs text-gray-500">{metric.titleEn}</p>
                        </div>
                      </div>
                      {getStatusBadge(metric.status)}
                    </div>
                    {renderMetricDetails(metric)}
                    {metric.lastUpdated && (
                      <p className="text-xs text-gray-400 mt-3">
                        अद्यतन: {formatDate(metric.lastUpdated)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            सेवा स्थिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <div key={service.id} className="p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-500">{service.titleEn}</p>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    {service.uptime !== null && service.uptime !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">अपटाइम:</span>
                        <span className="font-semibold">{service.uptime}%</span>
                      </div>
                    )}
                    {service.responseTime !== null && service.responseTime !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">प्रतिसाद वेळ:</span>
                        <span className="font-semibold">{service.responseTime}s</span>
                      </div>
                    )}
                    {service.lastUpdated && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">अद्यतन:</span>
                        <span className="font-semibold">
                          {new Date(service.lastUpdated).toLocaleDateString('mr-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-3">{service.description}</p>
                  )}
                  {service.uptime !== null && service.uptime !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>अपटाइम</span>
                        <span>{service.uptime}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            service.uptime >= 95
                              ? 'bg-green-500'
                              : service.uptime >= 85
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${service.uptime}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Gauge className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                स्मार्ट व्हिलेज माहिती
              </h3>
            </div>
            <p className="text-gray-600">
              गावातील सर्व सुविधांची रियल-टाइम माहिती आणि स्थिती
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Activity className="h-4 w-4 mr-2" />
                लाइव्ह स्थिती
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2" />
                तपशील पहा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
