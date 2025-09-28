import { Metadata } from 'next';
import { AnnouncementForm } from '@/components/admin/announcement-form';

export const metadata: Metadata = {
  title: 'नवीन सूचना - प्रशासन पैनल',
  description: 'नवीन सूचना तयार करा',
};

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">नवीन सूचना</h1>
        <p className="text-gray-600 mt-2">नवीन सूचना आणि जाहीरात तयार करा</p>
      </div>
      
      <AnnouncementForm />
    </div>
  );
}
