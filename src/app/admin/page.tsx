import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  History, 
  Megaphone, 
  Globe, 
  Image, 
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'डॅशबोर्ड - प्रशासन पैनल',
  description: 'ग्रामपंचायत वेबसाइट प्रशासन डॅशबोर्ड',
};

const dashboardStats = [
  {
    title: 'गाव माहिती',
    value: '1',
    icon: Users,
    href: '/admin/village-info',
    color: 'bg-blue-500',
  },
  {
    title: 'इतिहास कार्ड',
    value: '3',
    icon: History,
    href: '/admin/history',
    color: 'bg-amber-500',
  },
  {
    title: 'सूचना',
    value: '6',
    icon: Megaphone,
    href: '/admin/announcements',
    color: 'bg-purple-500',
  },
  {
    title: 'सांस्कृतिक वारसा',
    value: '4',
    icon: Globe,
    href: '/admin/cultural-heritage',
    color: 'bg-green-500',
  },
  {
    title: 'मुख्य प्रतिमा',
    value: '5',
    icon: Image,
    href: '/admin/hero-images',
    color: 'bg-indigo-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">डॅशबोर्ड</h1>
        <p className="text-gray-600 mt-2">वेबसाइट सामग्री व्यवस्थापन</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-4">
                <Button size="sm" variant="outline" asChild>
                  <Link href={stat.href}>
                    <Edit className="h-4 w-4 mr-2" />
                    संपादन
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/">
                    <Eye className="h-4 w-4 mr-2" />
                    पहा
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            द्रुत क्रिया
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link href="/admin/announcements/new">
                <Megaphone className="h-6 w-6" />
                <span>नवीन सूचना</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/history/new">
                <History className="h-6 w-6" />
                <span>इतिहास जोडा</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/hero-images/new">
                <Image className="h-6 w-6" />
                <span>प्रतिमा जोडा</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 flex-col space-y-2">
              <Link href="/admin/cultural-heritage/new">
                <Globe className="h-6 w-6" />
                <span>सांस्कृतिक माहिती</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>अलीकडील क्रिया</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">नवीन सूचना जोडली</p>
                <p className="text-xs text-gray-500">२ मिनिटांपूर्वी</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">गाव माहिती अपडेट केली</p>
                <p className="text-xs text-gray-500">१ तासापूर्वी</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">इतिहास कार्ड संपादित केले</p>
                <p className="text-xs text-gray-500">३ तासांपूर्वी</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
