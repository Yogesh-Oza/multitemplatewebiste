import { Metadata } from 'next';
import { AnnouncementsGrid } from '@/components/sections/announcements-grid';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'सूचना - ग्रामपंचायत',
  description: 'गाव कार्यालयाकडून महत्त्वाच्या सूचना, अद्यतने आणि जाहीराती',
  keywords: 'सूचना, ग्रामपंचायत, जाहीरात, अद्यतने, गाव',
};

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  मुख्यपृष्ठ
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">सूचना</h1>
                <p className="text-gray-600 mt-1">सर्व सूचना आणि जाहीराती</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <AnnouncementsGrid />
      </div>
    </div>
  );
}
