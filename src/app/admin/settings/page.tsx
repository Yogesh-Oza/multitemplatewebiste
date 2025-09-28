'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Type, 
  Save,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface WebsiteSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  fonts: {
    primaryFont: string;
    secondaryFont: string;
    headingFont: string;
  };
  layout: {
    headerStyle: string;
    footerStyle: string;
    sidebarStyle: string;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
  };
}

const mockSettings: WebsiteSettings = {
  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#3b82f6',
    accentColor: '#10b981',
    backgroundColor: '#ffffff'
  },
  fonts: {
    primaryFont: 'Inter',
    secondaryFont: 'Noto Sans Devanagari',
    headingFont: 'Inter'
  },
  layout: {
    headerStyle: 'modern',
    footerStyle: 'minimal',
    sidebarStyle: 'compact'
  },
  seo: {
    siteTitle: 'ग्रामपंचायत - आमच्या गावात स्वागत आहे',
    siteDescription: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
    keywords: 'ग्रामपंचायत, गाव, महाराष्ट्र, स्थानिक स्वराज्य, ग्राम विकास'
  }
};

const fontOptions = [
  { value: 'Inter', label: 'Inter (आधुनिक)' },
  { value: 'Noto Sans Devanagari', label: 'Noto Sans Devanagari (देवनागरी)' },
  { value: 'Roboto', label: 'Roboto (सोपे)' },
  { value: 'Poppins', label: 'Poppins (स्टाइलिश)' },
  { value: 'Open Sans', label: 'Open Sans (वाचनीय)' }
];

const colorPresets = [
  { name: 'पर्पल थीम', primary: '#7c3aed', secondary: '#3b82f6', accent: '#10b981' },
  { name: 'ब्लू थीम', primary: '#3b82f6', secondary: '#1d4ed8', accent: '#06b6d4' },
  { name: 'ग्रीन थीम', primary: '#10b981', secondary: '#059669', accent: '#84cc16' },
  { name: 'ऑरेंज थीम', primary: '#f59e0b', secondary: '#d97706', accent: '#ef4444' },
  { name: 'पिंक थीम', primary: '#ec4899', secondary: '#be185d', accent: '#f97316' }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(mockSettings);
  const [activeTab, setActiveTab] = useState('theme');

  const handleSave = () => {
    toast.success('सेटिंग्स सेव्ह केल्या');
  };

  const handlePreview = () => {
    toast.success('प्रीव्ह्यू मोड सुरू केले');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'website-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('सेटिंग्स एक्सपोर्ट केल्या');
  };

  const tabs = [
    { id: 'theme', label: 'थीम', icon: Palette },
    { id: 'fonts', label: 'फॉन्ट', icon: Type },
    { id: 'layout', label: 'लेआउट', icon: Monitor },
    { id: 'seo', label: 'SEO', icon: Eye }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              मुख्यपृष्ठ
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">सेटिंग्स</h1>
            <p className="text-gray-600 mt-1">थीम, फॉन्ट आणि सामान्य सेटिंग्स</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            प्रीव्ह्यू
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            एक्सपोर्ट
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            सेव्ह करा
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme Settings */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>रंग थीम</span>
              </CardTitle>
              <CardDescription>
                वेबसाइटचे रंग आणि थीम सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div>
                <Label className="text-base font-medium">रंग प्रीसेट</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {colorPresets.map((preset, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSettings({
                        ...settings,
                        theme: {
                          ...settings.theme,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          accentColor: preset.accent
                        }
                      })}
                    >
                      <div className="flex space-x-2 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: preset.accent }}
                        ></div>
                      </div>
                      <p className="text-sm font-medium">{preset.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">प्राथमिक रंग</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, primaryColor: e.target.value }
                      })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, primaryColor: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">दुय्यम रंग</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, secondaryColor: e.target.value }
                      })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, secondaryColor: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Font Settings */}
      {activeTab === 'fonts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>फॉन्ट सेटिंग्स</span>
              </CardTitle>
              <CardDescription>
                वेबसाइटचे फॉन्ट आणि टाइपोग्राफी सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryFont">प्राथमिक फॉन्ट</Label>
                  <select
                    id="primaryFont"
                    value={settings.fonts.primaryFont}
                    onChange={(e) => setSettings({
                      ...settings,
                      fonts: { ...settings.fonts, primaryFont: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    {fontOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="secondaryFont">दुय्यम फॉन्ट</Label>
                  <select
                    id="secondaryFont"
                    value={settings.fonts.secondaryFont}
                    onChange={(e) => setSettings({
                      ...settings,
                      fonts: { ...settings.fonts, secondaryFont: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    {fontOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="headingFont">शीर्षक फॉन्ट</Label>
                  <select
                    id="headingFont"
                    value={settings.fonts.headingFont}
                    onChange={(e) => setSettings({
                      ...settings,
                      fonts: { ...settings.fonts, headingFont: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    {fontOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Font Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">फॉन्ट प्रीव्ह्यू</h4>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold" style={{ fontFamily: settings.fonts.headingFont }}>
                    शीर्षक फॉन्ट प्रीव्ह्यू
                  </h1>
                  <p className="text-base" style={{ fontFamily: settings.fonts.primaryFont }}>
                    प्राथमिक फॉन्ट प्रीव्ह्यू - हा मजकूर वाचण्यासाठी वापरला जाईल
                  </p>
                  <p className="text-sm" style={{ fontFamily: settings.fonts.secondaryFont }}>
                    दुय्यम फॉन्ट प्रीव्ह्यू - हा मजकूर सहायक माहितीसाठी वापरला जाईल
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Layout Settings */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>लेआउट सेटिंग्स</span>
              </CardTitle>
              <CardDescription>
                वेबसाइटचे लेआउट आणि डिझाइन सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="headerStyle">हेडर स्टाइल</Label>
                  <select
                    id="headerStyle"
                    value={settings.layout.headerStyle}
                    onChange={(e) => setSettings({
                      ...settings,
                      layout: { ...settings.layout, headerStyle: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="modern">आधुनिक</option>
                    <option value="classic">क्लासिक</option>
                    <option value="minimal">किमान</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="footerStyle">फुटर स्टाइल</Label>
                  <select
                    id="footerStyle"
                    value={settings.layout.footerStyle}
                    onChange={(e) => setSettings({
                      ...settings,
                      layout: { ...settings.layout, footerStyle: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="minimal">किमान</option>
                    <option value="detailed">तपशीलवार</option>
                    <option value="social">सोशल</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sidebarStyle">साइडबार स्टाइल</Label>
                  <select
                    id="sidebarStyle"
                    value={settings.layout.sidebarStyle}
                    onChange={(e) => setSettings({
                      ...settings,
                      layout: { ...settings.layout, sidebarStyle: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="compact">कॉम्पॅक्ट</option>
                    <option value="expanded">विस्तारित</option>
                    <option value="floating">फ्लोटिंग</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Settings */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>SEO सेटिंग्स</span>
              </CardTitle>
              <CardDescription>
                सर्च इंजिन ऑप्टिमायझेशन सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="siteTitle">साइट शीर्षक</Label>
                <Input
                  id="siteTitle"
                  value={settings.seo.siteTitle}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, siteTitle: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">साइट वर्णन</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.seo.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, siteDescription: e.target.value }
                  })}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="keywords">कीवर्ड</Label>
                <Input
                  id="keywords"
                  value={settings.seo.keywords}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, keywords: e.target.value }
                  })}
                  placeholder="कॉमा द्वारे विभक्त करा"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
