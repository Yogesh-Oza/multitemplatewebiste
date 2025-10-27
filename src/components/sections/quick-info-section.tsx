'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Home, MapPin, BookOpen, Droplets, Cloud } from 'lucide-react';

interface QuickInfoSectionProps {
  villageStats?: {
    population?: number;
    families?: number;
    area?: number;
    literacyRate?: number;
    waterSources?: number;
  };
  weather?: {
    temperature?: number;
    condition?: string;
    humidity?: number;
  };
  dailyQuote?: string;
}

export function QuickInfoSection({ villageStats, weather, dailyQuote }: QuickInfoSectionProps) {
  const { t, language } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: villageStats?.population || '1,958',
      label: t('quickInfo.population'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Home,
      value: villageStats?.families || '227',
      label: t('quickInfo.families'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: MapPin,
      value: villageStats?.area || '654.40',
      label: t('quickInfo.area'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BookOpen,
      value: villageStats?.literacyRate || '85%',
      label: t('quickInfo.literacyRate'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Droplets,
      value: villageStats?.waterSources || '12',
      label: t('quickInfo.waterSources'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <section id="quickInfo" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('quickInfo.title')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weather Widget */}
        {weather && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Cloud className="w-12 h-12 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('quickInfo.weather')}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {weather.temperature}°C
                    </div>
                    <div className="text-sm text-gray-600">
                      {weather.condition} • {weather.humidity}% humidity
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Quote */}
        {dailyQuote && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('quickInfo.dailyQuote')}
              </h3>
              <blockquote className="text-lg text-gray-700 italic">
                "{dailyQuote}"
              </blockquote>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}