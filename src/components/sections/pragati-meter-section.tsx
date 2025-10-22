'use client';

import { TrendingUp, Users, Home, Droplets, Zap, TreePine, CheckCircle } from 'lucide-react';

interface PragatiMetric {
  key: string;
  label: string;
  labelEn: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
}

interface PragatiMeterSectionProps {
  dashboardMetrics: PragatiMetric[];
}

export function PragatiMeterSection({ dashboardMetrics }: PragatiMeterSectionProps) {
  // Use provided metrics or fallback to default
  const metrics = dashboardMetrics && dashboardMetrics.length > 0 ? dashboardMetrics : [
          {
            key: 'sanitation',
            label: 'स्वच्छता कव्हरेज',
            labelEn: 'Sanitation Coverage',
            value: 85,
            unit: '%',
            target: 100,
            icon: 'CheckCircle',
            color: 'green'
          },
          {
            key: 'electricity',
            label: 'वीजपुरवठा',
            labelEn: 'Electricity Supply',
            value: 92,
            unit: '%',
            target: 100,
            icon: 'Zap',
            color: 'yellow'
          },
          {
            key: 'water',
            label: 'पाणीपुरवठा',
            labelEn: 'Water Supply',
            value: 78,
            unit: '%',
            target: 100,
            icon: 'Droplets',
            color: 'blue'
          },
          {
            key: 'trees',
            label: 'वृक्षारोपण',
            labelEn: 'Tree Plantation',
            value: 1200,
            unit: 'झाडे',
            target: 2000,
            icon: 'TreePine',
            color: 'green'
          }
        ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="h-6 w-6" />;
      case 'Zap':
        return <Zap className="h-6 w-6" />;
      case 'Droplets':
        return <Droplets className="h-6 w-6" />;
      case 'TreePine':
        return <TreePine className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'blue':
        return 'text-blue-600 bg-blue-100';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };


  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            प्रगती मीटर
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            समृद्ध पंचायत योजना प्रगती, स्वच्छता टक्केवारी, नळजोडणी कव्हरेज इत्यादी दाखविणारा अॅनिमेटेड इन्फोग्राफिक
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const percentage = metric.unit === '%' 
              ? metric.value 
              : Math.min((metric.value / metric.target) * 100, 100);
            
            return (
              <div key={metric.key} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                    {getIcon(metric.icon)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.value}{metric.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metric.target > 100 ? `लक्ष्य: ${metric.target}${metric.unit}` : ''}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {metric.label}
                </h3>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      metric.color === 'green' ? 'bg-green-500' :
                      metric.color === 'blue' ? 'bg-blue-500' :
                      metric.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{percentage.toFixed(0)}% पूर्ण</span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    प्रगती
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="h-5 w-5" />
            संपूर्ण डॅशबोर्ड पहा
          </a>
        </div>
      </div>
    </section>
  );
}
