import { Metadata } from 'next';
import { AnnouncementsList } from '@/components/admin/announcements-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'सूचना व्यवस्थापन - प्रशासन पैनल',
  description: 'सूचना आणि जाहीराती व्यवस्थापन',
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">सूचना व्यवस्थापन</h1>
          <p className="text-gray-600 mt-2">सूचना आणि जाहीराती व्यवस्थापन</p>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <Plus className="h-4 w-4 mr-2" />
            नवीन सूचना
          </Link>
        </Button>
      </div>
      
      <AnnouncementsList />
    </div>
  );
}
