'use client';

import { useState } from 'react';
import { FileText, Users, AlertTriangle, Download, Calendar, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MeetingNotificationsAdmin from '@/components/admin/announcements/meeting-notifications-admin';
import CircularsAdmin from '@/components/admin/announcements/circulars-admin';
import ImportantDeadlinesAdmin from '@/components/admin/announcements/important-deadlines-admin';
import DownloadableFilesAdmin from '@/components/admin/announcements/downloadable-files-admin';
import CalendarEventsAdmin from '@/components/admin/announcements/calendar-events-admin';
import AnnouncementsAdmin from '@/components/admin/announcements/announcements-admin';

export default function AnnouncementsCircularsAdminPage() {
  const [activeTab, setActiveTab] = useState('meetings');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">घोषणा आणि परिपत्रके</h1>
        <p className="text-gray-600 mt-2">Announcements & Circulars Management</p>
        <p className="text-sm text-gray-500 mt-1">
          बैठकीच्या सूचना, परिपत्रके, महत्त्वाच्या मुदती, डाउनलोड विभाग आणि कॅलेंडर व्यवस्थापन
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">बैठकीच्या सूचना</span>
          </TabsTrigger>
          <TabsTrigger value="circulars" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">परिपत्रके</span>
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden md:inline">महत्त्वाच्या मुदती</span>
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">डाउनलोड</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">कॅलेंडर</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">सूचना</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="mt-6">
          <MeetingNotificationsAdmin />
        </TabsContent>

        <TabsContent value="circulars" className="mt-6">
          <CircularsAdmin />
        </TabsContent>

        <TabsContent value="deadlines" className="mt-6">
          <ImportantDeadlinesAdmin />
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <DownloadableFilesAdmin />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarEventsAdmin />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <AnnouncementsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}

