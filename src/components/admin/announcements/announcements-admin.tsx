'use client';

import { AnnouncementsSection } from '@/components/admin/homepage/announcements-section';

export default function AnnouncementsAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">सूचना</h2>
        <p className="text-gray-600 mt-1">Notifications Management</p>
      </div>
      <AnnouncementsSection />
    </div>
  );
}

