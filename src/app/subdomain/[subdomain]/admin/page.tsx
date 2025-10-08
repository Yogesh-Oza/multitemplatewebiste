import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  History, 
  Megaphone, 
  Globe, 
  Image, 
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SubdomainAdminPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainAdminPage({ params }: SubdomainAdminPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data with counts
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      announcements: {
        where: { isActive: true }
      },
      culturalHeritage: {
        where: { isActive: true }
      },
      heroImages: {
        where: { isActive: true }
      },
      historyCards: {
        where: { isActive: true }
      }
    }
  });

  if (!subdomainData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Village Not Found</h2>
          <p className="text-gray-600">The requested subdomain does not exist.</p>
        </div>
      </div>
    );
  }

  const websiteSections = [
    {
      title: 'गाव माहिती',
      titleEn: 'Village Information',
      description: 'गावाची मुख्य माहिती आणि आकडेवारी',
      descriptionEn: 'Main village information and statistics',
      icon: Users,
      href: `/subdomain/${subdomain}/admin/village-info`,
      count: subdomainData.villageInfo ? 1 : 0,
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      title: 'इतिहास कार्ड',
      titleEn: 'History Cards',
      description: 'गावाचा इतिहास आणि परंपरा',
      descriptionEn: 'Village history and traditions',
      icon: History,
      href: `/subdomain/${subdomain}/admin/history`,
      count: subdomainData.historyCards.length,
      color: 'bg-orange-500',
      status: 'active'
    },
    {
      title: 'सूचना',
      titleEn: 'Announcements',
      description: 'सूचना आणि जाहीराती व्यवस्थापन',
      descriptionEn: 'Announcements and notices management',
      icon: Megaphone,
      href: `/subdomain/${subdomain}/admin/announcements`,
      count: subdomainData.announcements.length,
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      title: 'सांस्कृतिक वारसा',
      titleEn: 'Cultural Heritage',
      description: 'सांस्कृतिक उत्सव आणि परंपरागत कला',
      descriptionEn: 'Cultural festivals and traditional arts',
      icon: Globe,
      href: `/subdomain/${subdomain}/admin/cultural-heritage`,
      count: subdomainData.culturalHeritage.length,
      color: 'bg-green-500',
      status: 'active'
    },
    {
      title: 'मुख्य प्रतिमा',
      titleEn: 'Hero Images',
      description: 'होमपेज मुख्य प्रतिमा व्यवस्थापन',
      descriptionEn: 'Homepage hero images management',
      icon: Image,
      href: `/subdomain/${subdomain}/admin/hero-images`,
      count: subdomainData.heroImages.length,
      color: 'bg-indigo-500',
      status: 'active'
    }
  ];

  const quickActions = [
    {
      title: 'नवीन सूचना जोडा',
      titleEn: 'Add New Announcement',
      description: 'तातडीची सूचना जोडा',
      icon: Plus,
      href: `/subdomain/${subdomain}/admin/announcements/new`,
      color: 'bg-blue-500'
    },
    {
      title: 'गाव माहिती अपडेट करा',
      titleEn: 'Update Village Info',
      description: 'गावाची मुख्य माहिती संपादित करा',
      icon: Edit,
      href: `/subdomain/${subdomain}/admin/village-info`,
      color: 'bg-green-500'
    },
    {
      title: 'प्रतिमा अपलोड करा',
      titleEn: 'Upload Images',
      description: 'नवीन प्रतिमा जोडा',
      icon: Image,
      href: `/subdomain/${subdomain}/admin/hero-images`,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {subdomainData.villageName} - डॅशबोर्ड
          </h1>
          <p className="text-gray-600 mt-1">
            {subdomainData.villageNameEn} - वेबसाइट सामग्री व्यवस्थापन
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            सक्रिय
          </Badge>
          <Button variant="outline" asChild>
            <Link href={`https://${subdomain}.mahagp.in`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              वेबसाइट पहा
            </Link>
          </Button>
        </div>
      </div>

      {/* Village Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            गाव माहिती
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">गावाचे नाव</p>
              <p className="font-semibold">{subdomainData.villageName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Village Name</p>
              <p className="font-semibold">{subdomainData.villageNameEn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">संपर्क व्यक्ती</p>
              <p className="font-semibold">{subdomainData.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ईमेल</p>
              <p className="font-semibold">{subdomainData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">फोन</p>
              <p className="font-semibold">{subdomainData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">पत्ता</p>
              <p className="font-semibold">{subdomainData.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Sections Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">वेबसाइट विभाग</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websiteSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${section.color} text-white`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {section.count}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription className="text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={section.href}>
                      <Edit className="h-4 w-4 mr-1" />
                      संपादन
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`https://${subdomain}.mahagp.in`} target="_blank">
                      <Eye className="h-4 w-4 mr-1" />
                      पहा
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">द्रुत क्रिया</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">अलीकडील क्रिया</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">गाव माहिती अपडेट केली</p>
                  <p className="text-xs text-gray-500">2 तासांपूर्वी</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">नवीन सूचना जोडली</p>
                  <p className="text-xs text-gray-500">4 तासांपूर्वी</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Image className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">प्रतिमा अपलोड केली</p>
                  <p className="text-xs text-gray-500">1 दिवसापूर्वी</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
