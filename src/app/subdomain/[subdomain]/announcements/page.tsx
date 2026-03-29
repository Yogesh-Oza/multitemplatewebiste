import { AnnouncementsSection } from '@/components/sections/announcements-section';
import MeetingNotificationsSection from '@/components/sections/meeting-notifications-section';
import CircularsSection from '@/components/sections/circulars-section';
import ImportantDeadlinesSection from '@/components/sections/important-deadlines-section';
import DownloadSection from '@/components/sections/download-section';
import InteractiveCalendarSection from '@/components/sections/interactive-calendar-section';
import { PrismaClient, CommunicationKind } from '@prisma/client';
import { redirect } from 'next/navigation';
import { publicCommsFilter } from '@/lib/services/communications';
import { communicationPostToAnnouncementShape } from '@/lib/communication-mappers';

const prisma = new PrismaClient();

interface AnnouncementsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainAnnouncementsPage({ params }: AnnouncementsPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      announcements: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  const now = new Date();
  const commAnnouncements = await prisma.communicationPost.findMany({
    where: publicCommsFilter(subdomainData.id, CommunicationKind.announcement, now),
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const legacyAnnouncements =
    commAnnouncements.length === 0
      ? await prisma.announcement.findMany({
          where: { subdomainId: subdomainData.id, isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        })
      : [];

  const announcementsList =
    commAnnouncements.length > 0
      ? commAnnouncements.map(communicationPostToAnnouncementShape)
      : legacyAnnouncements.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          date: a.date,
          imageUrl: a.image,
          priority: a.priority,
          status: a.status,
          category: a.category,
        }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        {/* Government Logo Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-blue-600">घो</div>
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="text-lg font-bold text-blue-600">प</div>
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="text-sm font-bold text-blue-600">स</div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">घोषणा</div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                घोषणा आणि परिपत्रके
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Announcements & Circulars
            </p>
            <p className="text-lg mb-8 opacity-80">
              बैठकीच्या सूचना, परिपत्रके, महत्त्वाच्या मुदती आणि डाउनलोड विभाग
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>बैठकीच्या सूचना</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>परिपत्रके</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>महत्त्वाच्या मुदती</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Notifications Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <MeetingNotificationsSection />
        </div>
      </section>

      {/* Circulars Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <CircularsSection />
        </div>
      </section>

      {/* Important Deadlines Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ImportantDeadlinesSection />
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <DownloadSection />
        </div>
      </section>

      {/* Interactive Calendar Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <InteractiveCalendarSection />
        </div>
      </section>

      {/* Basic Announcements Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <AnnouncementsSection announcements={announcementsList} />
        </div>
      </section>

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <div className="text-xl font-bold">महाराष्ट्र</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">महाराष्ट्र शासन</h3>
                <p className="text-lg opacity-90">Maharashtra Government</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">
              सर्व घोषणा आणि परिपत्रके भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली प्रकाशित
            </p>
            <p className="text-sm opacity-70">
              All announcements and circulars are published under the guidance of Government of India and Maharashtra Government
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
