import { prisma } from '@/lib/prisma';
import { SubdomainValidator } from '@/components/subdomain-validator';
import {
  FileText,
  Building,
  Users,
  Calendar,
  MapPin,
  Home,
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
} from 'lucide-react';
import { GR_SECTIONS, type GrSubsection } from '@/lib/gr-sections';

interface SitemapPageProps {
  params: Promise<{ subdomain: string }>;
}

function MarathiNumber(n: number) {
  const map = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(n)
    .split('')
    .map((d) => map[Number(d)] ?? d)
    .join('');
}

function renderSubsectionGroups(subsections: GrSubsection[]) {
  const blocks: Array<{ groupMr?: string; items: GrSubsection[] }> = [];
  for (const sub of subsections) {
    const last = blocks[blocks.length - 1];
    if (sub.groupMr && last?.groupMr === sub.groupMr) {
      last.items.push(sub);
    } else if (sub.groupMr) {
      blocks.push({ groupMr: sub.groupMr, items: [sub] });
    } else {
      blocks.push({ items: [sub] });
    }
  }
  return blocks;
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
    { title: 'कार्यक्रम', titleEn: 'Programs', url: '/programs', icon: Calendar, count: programsCount },
    { title: 'गॅलरी आणि मीडिया', titleEn: 'Gallery & Media', url: '/gallery', icon: Image, count: galleryCount },
    { title: 'अर्थसंकल्प', titleEn: 'Budget', url: '/jama-kharch', icon: DollarSign },
    { title: 'घोषणा', titleEn: 'Announcements', url: '/announcements', icon: Megaphone, count: announcementsCount },
    {
      title: 'योजना आणि लाभार्थी',
      titleEn: 'Schemes & Beneficiaries',
      url: '/gov-programs',
      icon: Award,
      count: governmentSchemesCount,
    },
    { title: 'विभाग', titleEn: 'Departments', url: '/departments', icon: Building, count: departmentsCount },
    { title: 'पायाभूत सुविधा', titleEn: 'Infrastructure', url: '/amenities', icon: Wrench, count: facilitiesCount },
    { title: 'नागरिक सेवा', titleEn: 'Citizen Services', url: '/citizen-services', icon: Phone },
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
    { title: 'तक्रार निवारण', titleEn: 'Grievance Redressal', url: '/feedback', icon: Users },
    { title: 'रोजगार आणि कौशल्य', titleEn: 'Employment & Skills', url: '/jobs', icon: Briefcase },
    { title: 'शिक्षण आणि युवक', titleEn: 'Education & Youth', url: '/education', icon: GraduationCap },
    { title: 'पर्यावरण आणि शाश्वत', titleEn: 'Environment & Sustainability', url: '/environment', icon: Leaf },
    { title: 'नोटिस', titleEn: 'Notices', url: '/notices', icon: Megaphone },
    { title: 'परिपत्रके', titleEn: 'Circulars', url: '/circulars', icon: FileText },
    { title: 'डाउनलोड्स', titleEn: 'Downloads', url: '/downloads', icon: FileText },
    { title: 'ग्राम सांख्यिकी', titleEn: 'Village statistics', url: '/village-statistics', icon: MapPin },
    { title: 'ग्राम सभा', titleEn: 'Gram Sabha', url: '/gram-sabha', icon: Calendar },
    { title: 'योजना ट्रॅकिंग', titleEn: 'Scheme tracking', url: '/scheme-tracking', icon: Building },
    { title: 'RTI', titleEn: 'RTI', url: '/rti', icon: FileText },
    { title: 'पारदर्शकता केंद्र', titleEn: 'Transparency hub', url: '/transparency', icon: DollarSign },
    { title: 'आमचे गाव', titleEn: 'Our Village', url: '/history', icon: History },
    { title: 'डॅशबोर्ड', titleEn: 'Dashboard', url: '/dashboard', icon: Home },
  ];

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-[#eef1f4]">
        <div className="bg-[#1e3a5f] text-white py-10">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">साइटमॅप / सामग्री निर्देशांक</h1>
            <p className="text-blue-100">
              {subdomainData.villageName} ग्रामपंचायत — शासन निर्णयानुसार विभाग
            </p>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          {/* Paper document style — matches GR layout sheet */}
          <article className="mx-auto max-w-3xl bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] border border-gray-200 px-6 py-8 md:px-12 md:py-12">
            <header className="border-b border-gray-300 pb-4 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center leading-snug">
                शासन निर्णयानुसार विभाग (GR Sections)
              </h2>
              <p className="text-center text-sm text-gray-500 mt-2">
                खालील यादीतील प्रत्येक मुद्दा क्लिक केल्यास संबंधित पानावर जाल
              </p>
            </header>

            <div className="space-y-8 text-[15px] md:text-base leading-relaxed text-gray-900">
              {GR_SECTIONS.map((section) => {
                const blocks = renderSubsectionGroups(section.subsections);
                const isActive = !section.comingSoon && section.subsections.length > 0;

                return (
                  <section key={section.id} className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-lg md:text-[1.15rem]">
                      {MarathiNumber(section.number)}. {section.titleMr}
                      {!section.titleMr.includes('(') && section.titleEn ? (
                        <span className="font-semibold text-gray-700"> ({section.titleEn})</span>
                      ) : null}
                      {!isActive && (
                        <span className="ml-2 text-xs font-normal text-gray-400">(लवकरच)</span>
                      )}
                    </h3>

                    {isActive ? (
                      <ul className="space-y-2 pl-1 md:pl-2">
                        {blocks.map((block, blockIndex) => {
                          if (block.groupMr) {
                            return (
                              <li key={`group-${block.groupMr}-${blockIndex}`} className="space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-gray-800 select-none shrink-0" aria-hidden>
                                    ▶
                                  </span>
                                  <span className="font-medium">{block.groupMr}:</span>
                                </div>
                                <ul className="space-y-1.5 pl-6 md:pl-8">
                                  {block.items.map((sub) => (
                                    <li key={sub.id}>
                                      <a
                                        href={`${sub.publicPath}#${sub.anchor}`}
                                        className="flex gap-2 group hover:text-blue-800"
                                      >
                                        <span className="text-gray-500 select-none shrink-0" aria-hidden>
                                          ○
                                        </span>
                                        <span className="underline-offset-2 group-hover:underline">
                                          {sub.sitemapLine || sub.titleMr}
                                        </span>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            );
                          }

                          const sub = block.items[0];
                          return (
                            <li key={sub.id} className="space-y-1">
                              <a
                                href={`${sub.publicPath}#${sub.anchor}`}
                                className="flex gap-2 group hover:text-blue-800"
                              >
                                <span className="text-gray-800 select-none shrink-0" aria-hidden>
                                  ▶
                                </span>
                                <span className="underline-offset-2 group-hover:underline">
                                  {sub.sitemapLine || sub.titleMr}
                                </span>
                              </a>
                              {sub.sitemapNested && sub.sitemapNested.length > 0 && (
                                <ul className="space-y-1 pl-6 md:pl-8 text-[14px] md:text-[15px] text-gray-700">
                                  {sub.sitemapNested.map((line) => (
                                    <li key={line} className="flex gap-2">
                                      <span className="select-none shrink-0" aria-hidden>
                                        ○
                                      </span>
                                      <span>{line}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="pl-6 text-sm text-gray-400">हा विभाग लवकरच जोडला जाईल.</p>
                    )}
                  </section>
                );
              })}
            </div>
          </article>

          <section className="mx-auto max-w-3xl mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-700" />
              इतर पाने
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherPages.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white rounded-md border border-gray-200 px-4 py-3 hover:border-green-400 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <page.icon className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{page.title}</p>
                      <p className="text-xs text-gray-500">{page.titleEn}</p>
                      {page.count !== undefined && (
                        <span className="inline-flex mt-1 text-[11px] text-green-800 bg-green-50 px-1.5 py-0.5 rounded">
                          {page.count} आयटम
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <p className="text-center text-gray-500 text-sm mt-8">
            अंतिम अद्यतन: {new Date().toLocaleDateString('mr-IN')}
          </p>
        </div>
      </div>
    </SubdomainValidator>
  );
}
