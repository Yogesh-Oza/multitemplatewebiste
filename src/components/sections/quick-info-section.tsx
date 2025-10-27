'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Droplets, 
  Cloud, 
  Quote,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface QuickInfoData {
  population: string;
  area: string;
  literacy: string;
  waterSources: string;
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  dailyQuote?: {
    quote: string;
    author?: string;
  };
}

interface QuickInfoSectionProps {
  data?: QuickInfoData;
}

export function QuickInfoSection({ data }: QuickInfoSectionProps) {
  const { t, language } = useTranslation();

  // Default data if not provided
  const defaultData: QuickInfoData = {
    population: '1,958',
    area: '654.40',
    literacy: '85%',
    waterSources: '12',
    weather: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65
    },
    dailyQuote: {
      quote: 'सर्वांसाठी विकास, सर्वांसाठी प्रगती',
      author: 'ग्रामपंचायत'
    }
  };

  const infoData = data || defaultData;

  const quickStats = [
    {
      icon: Users,
      label: t('sections.quickInfo.population'),
      value: infoData.population,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: MapPin,
      label: t('sections.quickInfo.area'),
      value: `${infoData.area} हेक्टर`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: BookOpen,
      label: t('sections.quickInfo.literacy'),
      value: infoData.literacy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Droplets,
      label: t('sections.quickInfo.waterSources'),
      value: infoData.waterSources,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <section id="quick-info" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.quickInfo.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Essential information about our village at a glance'
              : 'आमच्या गावाची मूलभूत माहिती एका नजरेस'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weather and Daily Quote Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Widget */}
          {infoData.weather && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-600" />
                    {t('sections.quickInfo.weather')}
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'mr-IN')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {infoData.weather.temperature}°C
                    </div>
                    <div className="text-gray-600">
                      {infoData.weather.condition}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {language === 'en' ? 'Humidity' : 'आर्द्रता'}: {infoData.weather.humidity}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'en' ? 'Updated' : 'अद्यतन'}: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Quote */}
          {infoData.dailyQuote && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Quote className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('sections.quickInfo.dailyQuote')}
                    </h3>
                    <blockquote className="text-gray-700 italic mb-2">
                      "{infoData.dailyQuote.quote}"
                    </blockquote>
                    {infoData.dailyQuote.author && (
                      <cite className="text-sm text-gray-500">
                        — {infoData.dailyQuote.author}
                      </cite>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}