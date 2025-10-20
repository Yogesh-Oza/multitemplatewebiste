'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  lastUpdated: string;
}

export function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Try to get weather from API first
      const response = await fetch('/api/weather');
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        // Fallback to static weather widget
        setWeather({
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          location: 'गाव',
          lastUpdated: new Date().toLocaleTimeString('mr-IN')
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback weather data
      setWeather({
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        location: 'गाव',
        lastUpdated: new Date().toLocaleTimeString('mr-IN')
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (cond.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!weather) return null;

  return (
    <section className="py-8 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                आजचे हवामान
              </h3>
              <span className="text-sm text-gray-500">
                {weather.lastUpdated}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weather.condition)}
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {weather.temperature}°C
                  </div>
                  <div className="text-sm text-gray-600">
                    {weather.condition}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Droplets className="h-4 w-4" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Wind className="h-4 w-4" />
                  <span>{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <a
                  href="https://www.imd.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  भारतीय हवामान विभाग - अधिक माहिती
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
