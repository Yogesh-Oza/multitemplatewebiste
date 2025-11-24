import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  Phone, 
  Mail, 
  ExternalLink,
  Star,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Wrench,
  Laptop,
  AlertTriangle
} from 'lucide-react';
import {
  jobOpportunitiesDemoData,
  tendersDemoData,
  trainingProgramsDemoData,
  fpoGroupsDemoData,
  villageTalentsDemoData,
  employmentContactInfoDemoData
} from '@/lib/demo-employment-skill';

const prisma = new PrismaClient();

interface JobsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

async function fetchJobsData(subdomainId: string) {
  try {
    const [jobs, tenders, programs, fpoGroups, talents, contacts] = await Promise.all([
      prisma.jobOpportunity.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.tender.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.trainingProgram.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.fpoGroup.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.villageTalent.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.employmentContactInfo.findMany({
        where: { subdomainId, isActive: true }
      })
    ]);

    const isDemo = jobs.length === 0 && tenders.length === 0 && programs.length === 0 && 
                   fpoGroups.length === 0 && talents.length === 0 && contacts.length === 0;

    return {
      jobs: jobs.length > 0 ? jobs.map(j => ({
        ...j,
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        requirementsEn: Array.isArray(j.requirementsEn) ? j.requirementsEn : []
      })) : jobOpportunitiesDemoData,
      tenders: tenders.length > 0 ? tenders : tendersDemoData,
      programs: programs.length > 0 ? programs : trainingProgramsDemoData,
      fpoGroups: fpoGroups.length > 0 ? fpoGroups.map(g => ({
        ...g,
        activities: Array.isArray(g.activities) ? g.activities : [],
        activitiesEn: Array.isArray(g.activitiesEn) ? g.activitiesEn : []
      })) : fpoGroupsDemoData,
      talents: talents.length > 0 ? talents.map(t => ({
        ...t,
        services: Array.isArray(t.services) ? t.services : [],
        servicesEn: Array.isArray(t.servicesEn) ? t.servicesEn : []
      })) : villageTalentsDemoData,
      contacts: contacts.length > 0 ? contacts : employmentContactInfoDemoData,
      isDemo
    };
  } catch (error) {
    console.error('Error fetching jobs data:', error);
    return {
      jobs: jobOpportunitiesDemoData,
      tenders: tendersDemoData,
      programs: trainingProgramsDemoData,
      fpoGroups: fpoGroupsDemoData,
      talents: villageTalentsDemoData,
      contacts: employmentContactInfoDemoData,
      isDemo: true
    };
  }
}

export default async function JobsPage({ params }: JobsPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  // Fetch dynamic data
  const { jobs: jobListings, tenders, programs: trainingPrograms, fpoGroups, talents: localTalents, contacts, isDemo } = await fetchJobsData(subdomainData.id);

  // Get contact info for display
  const generalContact = contacts.find((c: any) => c.section === 'general') || contacts.find((c: any) => c.section === 'jobs') || contacts[0];
  const employmentContact = contacts.find((c: any) => c.section === 'jobs') || generalContact;
    {
      id: 1,
      title: 'ग्रामसेवक',
      titleEn: 'Village Development Officer',
      organization: 'ग्रामपंचायत कार्यालय',
      organizationEn: 'Gram Panchayat Office',
      location: 'गाव, तालुका, जिल्हा',
      locationEn: 'Village, Taluka, District',
      type: 'सरकारी नोकरी',
      typeEn: 'Government Job',
      salary: '₹25,000 - ₹35,000',
      experience: '2-3 वर्षे',
      experienceEn: '2-3 Years',
      education: 'बी.ए. / बी.कॉम',
      educationEn: 'B.A. / B.Com',
      description: 'ग्रामपंचायत कार्यालयातील दैनंदिन कामकाज, नागरिक सेवा आणि विकास कार्यक्रमांमध्ये सहभाग',
      descriptionEn: 'Daily office work, citizen services and participation in development programs',
      requirements: ['मराठी भाषेचे ज्ञान', 'कंप्युटर साक्षरता', 'नागरिकांशी संवाद साधण्याची क्षमता'],
      requirementsEn: ['Knowledge of Marathi language', 'Computer literacy', 'Ability to communicate with citizens'],
      postedDate: '2024-01-15',
      lastDate: '2024-02-15',
      isUrgent: true
    },
    {
      id: 2,
      title: 'शिक्षक (अंगणवाडी)',
      titleEn: 'Anganwadi Teacher',
      organization: 'महिला व बाल विकास विभाग',
      organizationEn: 'Women & Child Development Department',
      location: 'अंगणवाडी केंद्र',
      locationEn: 'Anganwadi Center',
      type: 'सरकारी नोकरी',
      typeEn: 'Government Job',
      salary: '₹15,000 - ₹20,000',
      experience: '1-2 वर्षे',
      experienceEn: '1-2 Years',
      education: '12वी पास + प्रशिक्षण',
      educationEn: '12th Pass + Training',
      description: 'अंगणवाडी केंद्रातील मुलांची देखभाल, शिक्षण आणि पोषण कार्यक्रम',
      descriptionEn: 'Childcare, education and nutrition programs at Anganwadi center',
      requirements: ['महिला उमेदवार', 'मुलांशी प्रेम', 'सहनशीलता'],
      requirementsEn: ['Female candidate', 'Love for children', 'Patience'],
      postedDate: '2024-01-10',
      lastDate: '2024-02-10',
      isUrgent: false
    },
    {
      id: 3,
      title: 'स्वयंसेवक (NSS)',
      titleEn: 'NSS Volunteer',
      organization: 'राष्ट्रीय सेवा योजना',
      organizationEn: 'National Service Scheme',
      location: 'स्थानिक शाळा',
      locationEn: 'Local School',
      type: 'स्वयंसेवक',
      typeEn: 'Volunteer',
      salary: 'स्टायपेंड: ₹500/महिना',
      experience: 'कोणतेही नाही',
      experienceEn: 'No experience required',
      education: '10वी पास',
      educationEn: '10th Pass',
      description: 'सामुदायिक सेवा, स्वच्छता अभियान, शिक्षण कार्यक्रमांमध्ये सहभाग',
      descriptionEn: 'Community service, cleanliness campaigns, education programs',
      requirements: ['सामाजिक सेवेची इच्छा', 'टीम वर्क', 'नेतृत्व गुण'],
      requirementsEn: ['Desire for social service', 'Team work', 'Leadership qualities'],
      postedDate: '2024-01-05',
      lastDate: '2024-01-25',
      isUrgent: false
    }
  ];


  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                रोजगार आणि कौशल्य विकास
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                स्थानिक नोकऱ्या, प्रशिक्षण कार्यक्रम आणि स्वयंसाहाय्य गटांची माहिती
              </p>
              <p className="text-lg text-blue-200 mt-2">
                Employment & Skill Development - Jobs, Training & Self Help Groups
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {isDemo && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800">
                डेमो डेटा - प्रशासनामधून अपडेट करा
              </p>
            </div>
          )}

          {/* Job Listings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              नोकरी संधी (Job Opportunities)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobListings.map((job: any) => (
                <div key={job.id || job.title} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{job.titleEn}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building className="h-4 w-4" />
                        <span>{job.organization}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    {job.isUrgent && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        तातडीचे
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>शिक्षण:</strong> {job.education}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900 text-sm">आवश्यकता:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(Array.isArray(job.requirements) ? job.requirements : []).map((req: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>पोस्ट: {new Date(job.postedDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>शेवट: {new Date(job.lastDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {job.applicationUrl ? (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm text-center"
                      >
                        अर्ज करा
                      </a>
                    ) : (
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm" disabled>
                        अर्ज करा
                      </button>
                    )}
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tenders */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              निविदा (Tenders)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenders.map((tender: any) => (
                <div key={tender.id || tender.title} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tender.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{tender.titleEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {tender.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">मूल्य:</span>
                      <span className="font-medium">{tender.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">शेवटची तारीख:</span>
                      <span className="font-medium">{new Date(tender.lastDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">वर्ग:</span>
                      <span className="font-medium">{tender.category}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>आवश्यकता:</strong> {tender.requirements}
                  </div>

                  {tender.tenderUrl ? (
                    <a
                      href={tender.tenderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm text-center block"
                    >
                      निविदा पहा
                    </a>
                  ) : (
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm" disabled>
                      निविदा पहा
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Training Programs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-purple-600" />
              प्रशिक्षण कार्यक्रम (Training Programs)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingPrograms.map((program: any) => (
                <div key={program.id || program.title} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{program.titleEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">कालावधी:</span>
                      <span className="font-medium">{program.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">शुल्क:</span>
                      <span className="font-medium">{program.fee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">प्रशिक्षक:</span>
                      <span className="font-medium">{program.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">सुरुवात:</span>
                      <span className="font-medium">{new Date(program.startDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>नोंदणी</span>
                      <span>{program.enrolled || 0}/{program.seats || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${program.seats > 0 ? ((program.enrolled || 0) / program.seats) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {program.registrationUrl ? (
                    <a
                      href={program.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm text-center block"
                    >
                      नोंदणी करा
                    </a>
                  ) : (
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm" disabled>
                      नोंदणी करा
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FPO Groups */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-600" />
              FPO गट (FPO Groups)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fpoGroups.map((group: any) => (
                <div key={group.id || group.name} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{group.nameEn}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">सदस्य:</span>
                      <span className="font-medium">{group.members}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">स्थापना:</span>
                      <span className="font-medium">{group.established}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">संपर्क:</span>
                      <span className="font-medium">{group.contact}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">क्रियाकलाप:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(group.activities) ? group.activities : []).map((activity: string, index: number) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>उपलब्धी:</strong> {group.achievements}
                  </div>

                  <div className="flex gap-2">
                    {group.joinUrl ? (
                      <a
                        href={group.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm text-center"
                      >
                        सामील व्हा
                      </a>
                    ) : (
                      <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm" disabled>
                        सामील व्हा
                      </button>
                    )}
                    {group.contact && (
                      <a
                        href={`tel:${group.contact}`}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Talents Directory */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-600" />
              गाव टॅलेंट डायरेक्टरी (Village Talent Directory)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localTalents.map((talent: any) => (
                <div key={talent.id || talent.name} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{talent.name}</h3>
                      <p className="text-sm text-gray-600">{talent.nameEn}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">कौशल्य:</span>
                      <span className="font-medium">{talent.skill}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">अनुभव:</span>
                      <span className="font-medium">{talent.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">रेटिंग:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{talent.rating || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">सेवा:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(Array.isArray(talent.services) ? talent.services : []).map((service: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {talent.contact && (
                      <a
                        href={`tel:${talent.contact}`}
                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm text-center"
                      >
                        संपर्क करा
                      </a>
                    )}
                    {talent.contact && (
                      <a
                        href={`tel:${talent.contact}`}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              अधिक माहितीसाठी संपर्क करा
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {generalContact && (
                <div>
                  <strong>{generalContact.officeName}:</strong><br />
                  {generalContact.phone && <>दूरध्वनी: {generalContact.phone}<br /></>}
                  {generalContact.email && <>ईमेल: {generalContact.email}<br /></>}
                  {generalContact.address && <>{generalContact.address}</>}
                </div>
              )}
              {employmentContact && employmentContact.section !== generalContact?.section && (
                <div>
                  <strong>{employmentContact.officeName}:</strong><br />
                  {employmentContact.phone && <>दूरध्वनी: {employmentContact.phone}<br /></>}
                  {employmentContact.email && <>ईमेल: {employmentContact.email}<br /></>}
                  {employmentContact.address && <>{employmentContact.address}</>}
                </div>
              )}
              {(!generalContact && !employmentContact) && (
                <>
                  <div>
                    <strong>ग्रामपंचायत कार्यालय:</strong><br />
                    दूरध्वनी: +91 12345 67890<br />
                    ईमेल: jobs@grampanchayat.com
                  </div>
                  <div>
                    <strong>रोजगार केंद्र:</strong><br />
                    दूरध्वनी: +91 12345 67891<br />
                    ईमेल: employment@grampanchayat.com
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SubdomainValidator>
  );
}

export async function generateMetadata({ params }: JobsPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Employment Not Found',
      description: 'The requested employment information could not be found.'
    };
  }

  return {
    title: `रोजगार आणि कौशल्य विकास - ${subdomainData.villageName}`,
    description: `स्थानिक नोकऱ्या, प्रशिक्षण कार्यक्रम आणि स्वयंसाहाय्य गटांची माहिती ${subdomainData.villageName} ग्रामपंचायत`,
    keywords: `${subdomainData.villageName}, Employment, Jobs, Training, Skill Development, Gram Panchayat, Maharashtra`,
  };
}
