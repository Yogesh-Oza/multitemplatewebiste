import { prisma } from '@/lib/prisma';
import { SubdomainValidator } from '@/components/subdomain-validator';
import {
  FileText,
  Building,
  Users,
  Calendar,
  MapPin,
  Home,
  Info,
  History,
  Image,
  DollarSign,
  Megaphone,
  Award,
  Wrench,
  Phone,
  Briefcase,
  GraduationCap,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import { GR_SECTIONS } from '@/lib/gr-sections';

interface SitemapPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { subdomain } = await params;

  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      footerContent: true,
    },
  });

  if (!subdomainData) {
    return <div>Subdomain not found</div>;
  }

  const [
    announcementsCount,
    projectsCount,
    governmentResolutionsCount,
    culturalHeritageCount,
    programsCount,
    facilitiesCount,
    departmentsCount,
    governmentSchemesCount,
    galleryCount,
  ] = await Promise.all([
    prisma.announcement.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.project.count({ where: { subdomainId: subdomainData.id } }),
    prisma.governmentResolution.count({
      where: { subdomainId: subdomainData.id, isActive: true },
    }),
    prisma.culturalHeritage.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.program.count({ where: { subdomainId: subdomainData.id } }),
    prisma.facility.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.department.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.governmentScheme.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.gallery.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
  ]);

  const otherPages = [
    {
      title: 'कार्यक्रम',
      titleEn: 'Programs',
      url: '/programs',
      icon: Calendar,
      count: programsCount,
    },
    {
      title: 'गॅलरी आणि मीडिया',
      titleEn: 'Gallery & Media',
      url: '/gallery',
      icon: Image,
      count: galleryCount,
    },
    {
      title: 'अर्थसंकल्प',
      titleEn: 'Budget',
      url: '/jama-kharch',
      icon: DollarSign,
    },
    {
      title: 'घोषणा',
      titleEn: 'Announcements',
      url: '/announcements',
      icon: Megaphone,
      count: announcementsCount,
    },
    {
      title: 'योजना आणि लाभार्थी',
      titleEn: 'Schemes & Beneficiaries',
      url: '/gov-programs',
      icon: Award,
      count: governmentSchemesCount,
    },
    {
      title: 'विभाग',
      titleEn: 'Departments',
      url: '/departments',
      icon: Building,
      count: departmentsCount,
    },
    {
      title: 'पायाभूत सुविधा',
      titleEn: 'Infrastructure',
      url: '/amenities',
      icon: Wrench,
      count: facilitiesCount,
    },
    {
      title: 'नागरिक सेवा',
      titleEn: 'Citizen Services',
      url: '/citizen-services',
      icon: Phone,
    },
    {
      title: 'प्रकल्प आणि उपक्रम',
      titleEn: 'Projects & Initiatives',
      url: '/projects',
      icon: Building,
      count: projectsCount,
    },
    {
      title: 'शासकीय ठराव',
      titleEn: 'Government Resolutions',
      url: '/gr',
      icon: FileText,
      count: governmentResolutionsCount,
    },
    {
      title: 'सांस्कृतिक वारसा',
      titleEn: 'Cultural Heritage',
      url: '/cultural-heritage',
      icon: Users,
      count: culturalHeritageCount,
    },
    {
      title: 'तक्रार निवारण',
      titleEn: 'Grievance Redressal',
      url: '/feedback',
      icon: Users,
    },
    {
      title: 'रोजगार आणि कौशल्य',
      titleEn: 'Employment & Skills',
      url: '/jobs',
      icon: Briefcase,
    },
    {
      title: 'शिक्षण आणि युवक',
      titleEn: 'Education & Youth',
      url: '/education',
      icon: GraduationCap,
    },
    {
      title: 'पर्यावरण आणि शाश्वत',
      titleEn: 'Environment & Sustainability',
      url: '/environment',
      icon: Leaf,
    },
    {
      title: 'नोटिस',
      titleEn: 'Notices',
      url: '/notices',
      icon: Megaphone,
    },
    {
      title: 'परिपत्रके',
      titleEn: 'Circulars',
      url: '/circulars',
      icon: FileText,
    },
    {
      title: 'डाउनलोड्स',
      titleEn: 'Downloads',
      url: '/downloads',
      icon: FileText,
    },
    {
      title: 'ग्राम सांख्यिकी',
      titleEn: 'Village statistics',
      url: '/village-statistics',
      icon: MapPin,
    },
    {
      title: 'ग्राम सभा',
      titleEn: 'Gram Sabha',
      url: '/gram-sabha',
      icon: Calendar,
    },
    {
      title: 'योजना ट्रॅकिंग',
      titleEn: 'Scheme tracking',
      url: '/scheme-tracking',
      icon: Building,
    },
    {
      title: 'RTI',
      titleEn: 'RTI',
      url: '/rti',
      icon: FileText,
    },
    {
      title: 'पारदर्शकता केंद्र',
      titleEn: 'Transparency hub',
      url: '/transparency',
      icon: DollarSign,
    },
    {
      title: 'आमचे गाव',
      titleEn: 'Our Village',
      url: '/history',
      icon: History,
    },
    {
      title: 'डॅशबोर्ड',
      titleEn: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
  ];

  const activeGrSections = GR_SECTIONS.filter((s) => !s.comingSoon && s.subsections.length > 0);
  const upcomingGrSections = GR_SECTIONS.filter((s) => s.comingSoon);

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">साइटमॅप / सामग्री निर्देशांक</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {subdomainData.villageName} ग्रामपंचायत संकेतस्थळावरील सर्व पाने आणि सामग्री
              </p>
              <p className="text-lg text-blue-200 mt-2">
                Site Map / Content Index for {subdomainData.villageNameEn} Gram Panchayat
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-600" />
              शासन निर्णयानुसार विभाग (GR Sections)
            </h2>
            <div className="space-y-6">
              {activeGrSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.number}. {section.titleMr}
                    </h3>
                    <p className="text-sm text-gray-500">{section.titleEn}</p>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {section.subsections.map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={`${sub.publicPath}#${sub.anchor}`}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{sub.titleMr}</p>
                            <p className="text-xs text-gray-500">{sub.titleEn}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {upcomingGrSections.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">लवकरच येणारे विभाग</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingGrSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-white border border-dashed border-gray-300 rounded-lg px-4 py-3 text-gray-500"
                  >
                    <p className="font-medium">
                      {section.number}. {section.titleMr}
                    </p>
                    <p className="text-xs">{section.titleEn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              इतर पाने
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherPages.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <page.icon className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-xs text-gray-500">{page.titleEn}</p>
                      {page.count !== undefined && (
                        <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          {page.count} आयटम
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <div className="text-center text-gray-600 text-sm">
            अंतिम अद्यतन: {new Date().toLocaleDateString('mr-IN')} | Last Updated:{' '}
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>
      </div>
    </SubdomainValidator>
  );
}
