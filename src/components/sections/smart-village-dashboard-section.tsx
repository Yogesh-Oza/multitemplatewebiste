'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Droplets, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Gauge,
  Wifi,
  Signal,
  Battery,
  Sun,
  Cloud,
  CloudRain
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SmartVillageData {
  electricity: {
    status: 'on' | 'off' | 'maintenance';
    supplyHours: number;
    powerQuality: 'excellent' | 'good' | 'fair' | 'poor';
    lastOutage: string;
    nextMaintenance: string;
    consumption: {
      current: number;
      average: number;
      peak: number;
    };
  };
  water: {
    status: 'available' | 'low' | 'unavailable';
    supplyHours: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    lastTested: string;
    pressure: 'high' | 'medium' | 'low';
    consumption: {
      current: number;
      average: number;
      peak: number;
    };
  };
  connectivity: {
    internetStatus: 'connected' | 'disconnected' | 'slow';
    mobileNetwork: 'excellent' | 'good' | 'fair' | 'poor';
    wifiHotspots: number;
    lastUpdate: string;
  };
  environment: {
    temperature: number;
    humidity: number;
    airQuality: 'excellent' | 'good' | 'fair' | 'poor';
    weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    lastUpdate: string;
  };
  services: {
    id: string;
    name: string;
    nameEn: string;
    status: 'operational' | 'maintenance' | 'down';
    uptime: number;
    lastCheck: string;
    responseTime: number;
  }[];
}

interface SmartVillageDashboardSectionProps {
  data?: SmartVillageData;
}

export default function SmartVillageDashboardSection({ data }: SmartVillageDashboardSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Demo data for when no data is available
  const demoData: SmartVillageData = {
    electricity: {
      status: 'on',
      supplyHours: 22,
      powerQuality: 'good',
      lastOutage: '2024-11-15',
      nextMaintenance: '2024-12-15',
      consumption: {
        current: 1250,
        average: 1180,
        peak: 1450
      }
    },
    water: {
      status: 'available',
      supplyHours: 20,
      quality: 'good',
      lastTested: '2024-12-01',
      pressure: 'medium',
      consumption: {
        current: 850,
        average: 920,
        peak: 1100
      }
    },
    connectivity: {
      internetStatus: 'connected',
      mobileNetwork: 'good',
      wifiHotspots: 8,
      lastUpdate: '2024-12-01'
    },
    environment: {
      temperature: 28,
      humidity: 65,
      airQuality: 'good',
      weather: 'sunny',
      lastUpdate: '2024-12-01'
    },
    services: [
      {
        id: 'service-1',
        name: 'पाणी पुरवठा',
        nameEn: 'Water Supply',
        status: 'operational',
        uptime: 98.5,
        lastCheck: '2024-12-01',
        responseTime: 2.3
      },
      {
        id: 'service-2',
        name: 'वीज पुरवठा',
        nameEn: 'Electricity Supply',
        status: 'operational',
        uptime: 95.2,
        lastCheck: '2024-12-01',
        responseTime: 1.8
      },
      {
        id: 'service-3',
        name: 'इंटरनेट सेवा',
        nameEn: 'Internet Service',
        status: 'operational',
        uptime: 99.1,
        lastCheck: '2024-12-01',
        responseTime: 0.5
      },
      {
        id: 'service-4',
        name: 'स्वच्छता सेवा',
        nameEn: 'Sanitation Service',
        status: 'maintenance',
        uptime: 92.3,
        lastCheck: '2024-12-01',
        responseTime: 4.2
      }
    ]
  };

  const displayData = data || demoData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on':
      case 'available':
      case 'connected':
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'off':
      case 'unavailable':
      case 'disconnected':
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
      case 'low':
      case 'slow':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on':
        return 'चालू';
      case 'off':
        return 'बंद';
      case 'available':
        return 'उपलब्ध';
      case 'unavailable':
        return 'अनुपलब्ध';
      case 'connected':
        return 'जोडले';
      case 'disconnected':
        return 'तुटले';
      case 'operational':
        return 'चालू';
      case 'maintenance':
        return 'देखभाल';
      case 'down':
        return 'बंद';
      case 'low':
        return 'कमी';
      case 'slow':
        return 'मंद';
      default:
        return 'अज्ञात';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'उत्कृष्ट';
      case 'good':
        return 'चांगले';
      case 'fair':
        return 'सामान्य';
      case 'poor':
        return 'खराब';
      default:
        return 'अज्ञात';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return Sun;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'stormy':
        return CloudRain;
      default:
        return Sun;
    }
  };

  const getPressureColor = (pressure: string) => {
    switch (pressure) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPressureLabel = (pressure: string) => {
    switch (pressure) {
      case 'high':
        return 'उच्च';
      case 'medium':
        return 'मध्यम';
      case 'low':
        return 'कमी';
      default:
        return 'अज्ञात';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-green-100">
            <Gauge className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            स्मार्ट व्हिलेज डॅशबोर्ड
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Smart Village Dashboard
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          दररोजचा वीजपुरवठा, पाण्याची उपलब्धता आणि इतर सुविधांची रियल-टाइम माहिती
        </p>
      </div>

      {/* Real-time Status */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-6 w-6 text-green-600" />
            रियल-टाइम स्थिती
          </CardTitle>
          <p className="text-sm text-gray-600">
            अद्यतन: {currentTime.toLocaleString('mr-IN')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Electricity Status */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-gray-900">वीज पुरवठा</span>
                </div>
                <Badge className={`${getStatusColor(displayData.electricity.status)}`}>
                  {getStatusLabel(displayData.electricity.status)}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">पुरवठा तास:</span>
                  <span className="font-medium">{displayData.electricity.supplyHours} तास</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">गुणवत्ता:</span>
                  <Badge className={`${getQualityColor(displayData.electricity.powerQuality)} text-xs`}>
                    {getQualityLabel(displayData.electricity.powerQuality)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">वापर:</span>
                  <span className="font-medium">{displayData.electricity.consumption.current} kWh</span>
                </div>
              </div>
            </div>

            {/* Water Status */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">पाणी पुरवठा</span>
                </div>
                <Badge className={`${getStatusColor(displayData.water.status)}`}>
                  {getStatusLabel(displayData.water.status)}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">पुरवठा तास:</span>
                  <span className="font-medium">{displayData.water.supplyHours} तास</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">गुणवत्ता:</span>
                  <Badge className={`${getQualityColor(displayData.water.quality)} text-xs`}>
                    {getQualityLabel(displayData.water.quality)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">दाब:</span>
                  <Badge className={`${getPressureColor(displayData.water.pressure)} text-xs`}>
                    {getPressureLabel(displayData.water.pressure)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Connectivity Status */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">इंटरनेट</span>
                </div>
                <Badge className={`${getStatusColor(displayData.connectivity.internetStatus)}`}>
                  {getStatusLabel(displayData.connectivity.internetStatus)}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">मोबाइल नेटवर्क:</span>
                  <Badge className={`${getQualityColor(displayData.connectivity.mobileNetwork)} text-xs`}>
                    {getQualityLabel(displayData.connectivity.mobileNetwork)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WiFi हॉटस्पॉट:</span>
                  <span className="font-medium">{displayData.connectivity.wifiHotspots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">अद्यतन:</span>
                  <span className="font-medium">{new Date(displayData.connectivity.lastUpdate).toLocaleDateString('mr-IN')}</span>
                </div>
              </div>
            </div>

            {/* Environment Status */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const WeatherIcon = getWeatherIcon(displayData.environment.weather);
                    return <WeatherIcon className="h-5 w-5 text-orange-600" />;
                  })()}
                  <span className="font-semibold text-gray-900">हवामान</span>
                </div>
                <Badge className="text-blue-600 bg-blue-100">
                  {displayData.environment.weather === 'sunny' ? 'सूर्यप्रकाश' : 
                   displayData.environment.weather === 'cloudy' ? 'ढगाळ' : 
                   displayData.environment.weather === 'rainy' ? 'पावसाळी' : 'वादळी'}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">तापमान:</span>
                  <span className="font-medium">{displayData.environment.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">आर्द्रता:</span>
                  <span className="font-medium">{displayData.environment.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">हवेची गुणवत्ता:</span>
                  <Badge className={`${getQualityColor(displayData.environment.airQuality)} text-xs`}>
                    {getQualityLabel(displayData.environment.airQuality)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            सेवा स्थिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayData.services.map((service) => (
              <div key={service.id} className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.nameEn}</p>
                  </div>
                  <Badge className={`${getStatusColor(service.status)}`}>
                    {getStatusLabel(service.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">अपटाइम:</span>
                    <span className="font-medium">{service.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">प्रतिसाद वेळ:</span>
                    <span className="font-medium">{service.responseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">अद्यतन:</span>
                    <span className="font-medium">{new Date(service.lastCheck).toLocaleDateString('mr-IN')}</span>
                  </div>
                </div>
                
                {/* Uptime Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>अपटाइम</span>
                    <span>{service.uptime}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        service.uptime >= 95 ? 'bg-green-500' : 
                        service.uptime >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${service.uptime}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gauge className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                स्मार्ट व्हिलेज माहिती
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              गावातील सर्व सुविधांची रियल-टाइम माहिती आणि स्थिती
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Activity className="h-4 w-4 mr-2" />
                लाइव्ह स्थिती
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <BarChart3 className="h-4 w-4 mr-2" />
                तपशील पहा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
