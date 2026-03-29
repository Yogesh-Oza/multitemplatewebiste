import { prisma } from '@/lib/prisma';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { FileText, Building, Users, Calendar, MapPin, Home, Info, History, Image, DollarSign, Megaphone, Award, Wrench, Phone, Briefcase, GraduationCap, Leaf } from 'lucide-react';

interface SitemapPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { subdomain } = await params;

  // Fetch sitemap data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      footerContent: true
    }
  });

  if (!subdomainData) {
    return <div>Subdomain not found</div>;
  }

  // Get content counts
  const [
    announcementsCount,
    projectsCount,
    governmentResolutionsCount,
    culturalHeritageCount,
    programsCount,
    facilitiesCount,
    departmentsCount,
    governmentSchemesCount,
    galleryCount
  ] = await Promise.all([
    prisma.announcement.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.project.count({ where: { subdomainId: subdomainData.id } }),
    prisma.governmentResolution.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.culturalHeritage.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.program.count({ where: { subdomainId: subdomainData.id } }),
    prisma.facility.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.department.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.governmentScheme.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.gallery.count({ where: { subdomainId: subdomainData.id, isActive: true } })
  ]);

  const mainPages = [
    {
      title: 'मुख्यपृष्ठ',
      titleEn: 'Home',
      url: '/',
      icon: Home,
      description: 'ग्रामपंचायत मुख्यपृष्ठ',
      descriptionEn: 'Gram Panchayat Homepage'
    },
    {
      title: 'ग्रामपंचायतीबद्दल',
      titleEn: 'About Gram Panchayat',
      url: '/about',
      icon: Info,
      description: 'ग्रामपंचायत माहिती',
      descriptionEn: 'About Gram Panchayat'
    },
    {
      title: 'आमचे गाव',
      titleEn: 'Our Village',
      url: '/history',
      icon: History,
      description: 'गावाचा इतिहास आणि संस्कृती',
      descriptionEn: 'Village History and Culture'
    },
    {
      title: 'कार्यक्रम',
      titleEn: 'Programs',
      url: '/programs',
      icon: Calendar,
      description: 'सामुदायिक कार्यक्रम',
      descriptionEn: 'Community Programs',
      count: programsCount
    },
    {
      title: 'गॅलरी आणि मीडिया',
      titleEn: 'Gallery & Media',
      url: '/gallery',
      icon: Image,
      description: 'गॅलरी आणि मीडिया',
      descriptionEn: 'Gallery and Media',
      count: galleryCount
    },
    {
      title: 'अर्थसंकल्प',
      titleEn: 'Budget',
      url: '/jama-kharch',
      icon: DollarSign,
      description: 'अर्थसंकल्प आणि पारदर्शकता',
      descriptionEn: 'Budget and Transparency'
    },
    {
      title: 'घोषणा',
      titleEn: 'Announcements',
      url: '/announcements',
      icon: Megaphone,
      description: 'घोषणा आणि परिपत्रके',
      descriptionEn: 'Announcements and Circulars',
      count: announcementsCount
    },
    {
      title: 'योजना आणि लाभार्थी',
      titleEn: 'Schemes & Beneficiaries',
      url: '/gov-programs',
      icon: Award,
      description: 'सरकारी योजना आणि लाभार्थी माहिती',
      descriptionEn: 'Government Schemes and Beneficiary Information',
      count: governmentSchemesCount
    },
    {
      title: 'विभाग',
      titleEn: 'Departments',
      url: '/departments',
      icon: Building,
      description: 'विभागीय माहिती',
      descriptionEn: 'Department Information',
      count: departmentsCount
    },
    {
      title: 'पायाभूत सुविधा',
      titleEn: 'Infrastructure',
      url: '/amenities',
      icon: Wrench,
      description: 'ग्राम पायाभूत सुविधा आणि सुविधा',
      descriptionEn: 'Village Infrastructure and Facilities',
      count: facilitiesCount
    },
    {
      title: 'नागरिक सेवा',
      titleEn: 'Citizen Services',
      url: '/citizen-services',
      icon: Phone,
      description: 'नागरिक सेवा आणि फॉर्म्स',
      descriptionEn: 'Citizen Services and Forms'
    }
  ];

  const newPages = [
    {
      title: 'प्रकल्प आणि उपक्रम',
      titleEn: 'Projects & Initiatives',
      url: '/projects',
      icon: Building,
      description: 'प्रमुख प्रकल्प आणि उपक्रम',
      descriptionEn: 'Key Projects and Initiatives',
      count: projectsCount
    },
    {
      title: 'शासकीय ठराव',
      titleEn: 'Government Resolutions',
      url: '/gr',
      icon: FileText,
      description: 'शासकीय ठराव आणि परिपत्रके',
      descriptionEn: 'Government Resolutions and Circulars',
      count: governmentResolutionsCount
    },
    {
      title: 'सांस्कृतिक वारसा',
      titleEn: 'Cultural Heritage',
      url: '/cultural-heritage',
      icon: Users,
      description: 'गावाचा सांस्कृतिक वारसा',
      descriptionEn: 'Village Cultural Heritage',
      count: culturalHeritageCount
    },
    {
      title: 'तक्रार निवारण',
      titleEn: 'Grievance Redressal',
      url: '/feedback',
      icon: Users,
      description: 'तक्रार निवारण आणि फीडबॅक',
      descriptionEn: 'Grievance Redressal and Feedback'
    },
    {
      title: 'रोजगार आणि कौशल्य',
      titleEn: 'Employment & Skills',
      url: '/jobs',
      icon: Briefcase,
      description: 'रोजगार आणि कौशल्य विकास',
      descriptionEn: 'Employment and Skill Development'
    },
    {
      title: 'शिक्षण आणि युवक',
      titleEn: 'Education & Youth',
      url: '/education',
      icon: GraduationCap,
      description: 'शिक्षण आणि युवक कोपरा',
      descriptionEn: 'Education and Youth Corner'
    },
    {
      title: 'पर्यावरण आणि शाश्वत',
      titleEn: 'Environment & Sustainability',
      url: '/environment',
      icon: Leaf,
      description: 'पर्यावरण आणि शाश्वत विकास',
      descriptionEn: 'Environment and Sustainable Development'
    },
    {
      title: 'नोटिस',
      titleEn: 'Notices',
      url: '/notices',
      icon: Megaphone,
      description: 'नोटिस',
      descriptionEn: 'Notices',
    },
    {
      title: 'परिपत्रके',
      titleEn: 'Circulars',
      url: '/circulars',
      icon: FileText,
      description: 'परिपत्रके',
      descriptionEn: 'Circulars',
    },
    {
      title: 'डाउनलोड्स',
      titleEn: 'Downloads',
      url: '/downloads',
      icon: FileText,
      description: 'कागदपत्रे',
      descriptionEn: 'Downloads',
    },
    {
      title: 'ग्राम सांख्यिकी',
      titleEn: 'Village statistics',
      url: '/village-statistics',
      icon: MapPin,
      description: 'वर्षनिहाय सांख्यिकी',
      descriptionEn: 'Year-wise statistics',
    },
    {
      title: 'ग्राम सभा',
      titleEn: 'Gram Sabha',
      url: '/gram-sabha',
      icon: Calendar,
      description: 'ग्राम सभा नोंदी',
      descriptionEn: 'Gram Sabha records',
    },
    {
      title: 'योजना ट्रॅकिंग',
      titleEn: 'Scheme tracking',
      url: '/scheme-tracking',
      icon: Building,
      description: 'भौतिक व आर्थिक प्रगती',
      descriptionEn: 'Physical and financial progress',
    },
    {
      title: 'RTI',
      titleEn: 'RTI',
      url: '/rti',
      icon: FileText,
      description: 'माहितीचा अधिकार',
      descriptionEn: 'Right to Information',
    },
    {
      title: 'पारदर्शकता केंद्र',
      titleEn: 'Transparency hub',
      url: '/transparency',
      icon: DollarSign,
      description: 'सारांश डॅशबोर्ड',
      descriptionEn: 'Transparency dashboard',
    }
  ];

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                साइटमॅप / सामग्री निर्देशांक
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {subdomainData.villageName} ग्रामपंचायत संकेतस्थळावरील सर्व पाने आणि सामग्री
              </p>
              <p className="text-lg text-blue-200 mt-2">
                Site Map / Content Index for {subdomainData.villageNameEn} Gram Panchayat
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Main Pages */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              मुख्य पाने (Main Pages)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainPages.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <page.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {page.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {page.titleEn}
                        </span>
                        {page.count !== undefined && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {page.count} आयटम
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* New Pages */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              नवीन पाने (New Pages)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newPages.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <page.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {page.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {page.titleEn}
                        </span>
                        {page.count !== undefined && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {page.count} आयटम
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Content Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              सामग्री सांख्यिकी (Content Statistics)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {announcementsCount}
                </div>
                <div className="text-sm text-gray-600">घोषणा</div>
                <div className="text-xs text-gray-500">Announcements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {projectsCount}
                </div>
                <div className="text-sm text-gray-600">प्रकल्प</div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {governmentResolutionsCount}
                </div>
                <div className="text-sm text-gray-600">शासकीय ठराव</div>
                <div className="text-xs text-gray-500">Government Resolutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {culturalHeritageCount}
                </div>
                <div className="text-sm text-gray-600">सांस्कृतिक वारसा</div>
                <div className="text-xs text-gray-500">Cultural Heritage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {programsCount}
                </div>
                <div className="text-sm text-gray-600">कार्यक्रम</div>
                <div className="text-xs text-gray-500">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {facilitiesCount}
                </div>
                <div className="text-sm text-gray-600">सुविधा</div>
                <div className="text-xs text-gray-500">Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {departmentsCount}
                </div>
                <div className="text-sm text-gray-600">विभाग</div>
                <div className="text-xs text-gray-500">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {governmentSchemesCount}
                </div>
                <div className="text-sm text-gray-600">शासकीय योजना</div>
                <div className="text-xs text-gray-500">Government Schemes</div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              अंतिम अद्यतन: {new Date().toLocaleDateString('mr-IN')} | 
              Last Updated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </SubdomainValidator>
  );
}
