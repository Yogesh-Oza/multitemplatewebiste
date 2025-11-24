import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp,
  Trophy,
  Target,
  Laptop,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  User,
  School,
  BookMarked,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import {
  schoolsDemoData,
  scholarshipSchemesDemoData,
  studentAchievementsDemoData,
  careerGuidanceDemoData,
  nssActivitiesDemoData,
  youthSuccessStoriesDemoData,
  educationContactInfoDemoData
} from '@/lib/demo-education-youth';

const prisma = new PrismaClient();

interface EducationPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

async function fetchEducationData(subdomainId: string) {
  try {
    const [schools, scholarships, achievements, careerSessions, nssActivities, youthStories, contacts] = await Promise.all([
      prisma.school.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.scholarshipScheme.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.studentAchievement.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.careerGuidance.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.nSSActivity.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.youthSuccessStory.findMany({
        where: { subdomainId, isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.educationContactInfo.findMany({
        where: { subdomainId, isActive: true }
      })
    ]);

    const isDemo = schools.length === 0 && scholarships.length === 0 && achievements.length === 0 && 
                   careerSessions.length === 0 && nssActivities.length === 0 && youthStories.length === 0 && contacts.length === 0;

    return {
      schools: schools.length > 0 ? schools.map(s => ({
        ...s,
        facilities: Array.isArray(s.facilities) ? s.facilities : [],
        facilitiesEn: Array.isArray(s.facilitiesEn) ? s.facilitiesEn : [],
        achievements: Array.isArray(s.achievements) ? s.achievements : [],
        achievementsEn: Array.isArray(s.achievementsEn) ? s.achievementsEn : []
      })) : schoolsDemoData,
      scholarships: scholarships.length > 0 ? scholarships : scholarshipSchemesDemoData,
      achievements: achievements.length > 0 ? achievements : studentAchievementsDemoData,
      careerSessions: careerSessions.length > 0 ? careerSessions : careerGuidanceDemoData,
      nssActivities: nssActivities.length > 0 ? nssActivities : nssActivitiesDemoData,
      youthStories: youthStories.length > 0 ? youthStories : youthSuccessStoriesDemoData,
      contacts: contacts.length > 0 ? contacts : educationContactInfoDemoData,
      isDemo
    };
  } catch (error) {
    console.error('Error fetching education data:', error);
    return {
      schools: schoolsDemoData,
      scholarships: scholarshipSchemesDemoData,
      achievements: studentAchievementsDemoData,
      careerSessions: careerGuidanceDemoData,
      nssActivities: nssActivitiesDemoData,
      youthStories: youthSuccessStoriesDemoData,
      contacts: educationContactInfoDemoData,
      isDemo: true
    };
  }
}

export default async function EducationPage({ params }: EducationPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  // Fetch dynamic data
  const { schools, scholarships, achievements: studentAchievements, careerSessions: careerGuidance, nssActivities, youthStories, contacts, isDemo } = await fetchEducationData(subdomainData.id);

  // Get contact info for display
  const educationContact = contacts.find((c: any) => c.section === 'education');
  const youthContact = contacts.find((c: any) => c.section === 'youth');

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                शिक्षण आणि युवक कोपरा
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                शाळा, शिष्यवृत्ती, करिअर मार्गदर्शन आणि युवक उपक्रम
              </p>
              <p className="text-lg text-purple-200 mt-2">
                Education & Youth Corner - Schools, Scholarships, Career Guidance & Youth Programs
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

          {/* Schools Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <School className="h-6 w-6 text-purple-600" />
              शाळा (Schools)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schools.map((school: any) => (
                <div key={school.id || school.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {school.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{school.nameEn}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{school.students}</div>
                      <div className="text-sm text-gray-600">विद्यार्थी</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{school.teachers}</div>
                      <div className="text-sm text-gray-600">शिक्षक</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">वर्ग:</span>
                      <span className="font-medium">{school.classes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">स्थापना:</span>
                      <span className="font-medium">{school.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">संपर्क:</span>
                      <span className="font-medium">{school.contact}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">सुविधा:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(school.facilities) ? school.facilities : []).map((facility: string, index: number) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">उपलब्धी:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(Array.isArray(school.achievements) ? school.achievements : []).map((achievement: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>पत्ता:</strong> {school.address}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-green-600" />
              शिष्यवृत्ती योजना (Scholarship Schemes)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship: any) => (
                <div key={scholarship.id || scholarship.name} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {scholarship.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{scholarship.nameEn}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">रक्कम:</span>
                      <span className="font-medium text-green-600">{scholarship.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">शेवटची तारीख:</span>
                      <span className="font-medium">{new Date(scholarship.lastDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">वर्ग:</span>
                      <span className="font-medium">{scholarship.category}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {scholarship.description}
                  </p>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>पात्रता:</strong> {scholarship.eligibility}
                  </div>

                  {scholarship.applicationUrl ? (
                    <a
                      href={scholarship.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm text-center block"
                    >
                      अर्ज करा
                    </a>
                  ) : (
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm" disabled>
                      अर्ज करा
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Achievements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              विद्यार्थी उपलब्धी (Student Achievements)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentAchievements.map((achievement: any) => (
                <div key={achievement.id || achievement.name} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.nameEn}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">वर्ग:</span>
                      <span className="font-medium">{achievement.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">वर्ष:</span>
                      <span className="font-medium">{achievement.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">शाळा:</span>
                      <span className="font-medium text-xs">{achievement.school}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">उपलब्धी:</h4>
                    <p className="text-sm text-gray-700">{achievement.achievement}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      achievement.category === 'शैक्षणिक' ? 'bg-blue-100 text-blue-800' :
                      achievement.category === 'क्रीडा' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {achievement.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Guidance */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              करिअर मार्गदर्शन (Career Guidance)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerGuidance.map((guidance: any) => (
                <div key={guidance.id || guidance.title} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guidance.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{guidance.titleEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {guidance.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">कालावधी:</span>
                      <span className="font-medium">{guidance.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">तारीख:</span>
                      <span className="font-medium">{new Date(guidance.date).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">वेळ:</span>
                      <span className="font-medium">{guidance.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">वक्ता:</span>
                      <span className="font-medium text-xs">{guidance.speaker}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {guidance.type}
                    </span>
                  </div>

                  {guidance.registrationUrl ? (
                    <a
                      href={guidance.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm text-center block"
                    >
                      नोंदणी करा
                    </a>
                  ) : (
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm" disabled>
                      नोंदणी करा
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NSS Activities */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-600" />
              NSS उपक्रम (NSS Activities)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nssActivities.map((activity: any) => (
                <div key={activity.id || activity.title} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{activity.titleEn}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">तारीख:</span>
                      <span className="font-medium">{new Date(activity.date).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">सहभागी:</span>
                      <span className="font-medium">{activity.participants}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {activity.description}
                  </p>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>परिणाम:</strong> {activity.impact}
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">पूर्ण</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Youth Success Stories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
              युवक यशोगाथा (Youth Success Stories)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {youthStories.map((story: any) => (
                <div key={story.id || story.name} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.nameEn}</p>
                      <p className="text-xs text-gray-500">वय: {story.age} वर्षे</p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {story.story}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">उपलब्धी:</span>
                      <span className="font-medium">{story.achievement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">सध्याचे:</span>
                      <span className="font-medium text-xs">{story.current}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">यशस्वी</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              अधिक माहितीसाठी संपर्क करा
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {educationContact && (
                <div>
                  <strong>{educationContact.officeName}:</strong><br />
                  {educationContact.phone && <>दूरध्वनी: {educationContact.phone}<br /></>}
                  {educationContact.email && <>ईमेल: {educationContact.email}<br /></>}
                  {educationContact.address && <>{educationContact.address}</>}
                </div>
              )}
              {youthContact && (
                <div>
                  <strong>{youthContact.officeName}:</strong><br />
                  {youthContact.phone && <>दूरध्वनी: {youthContact.phone}<br /></>}
                  {youthContact.email && <>ईमेल: {youthContact.email}<br /></>}
                  {youthContact.address && <>{youthContact.address}</>}
                </div>
              )}
              {(!educationContact && !youthContact) && (
                <>
                  <div>
                    <strong>शिक्षण विभाग:</strong><br />
                    दूरध्वनी: +91 12345 67890<br />
                    ईमेल: education@grampanchayat.com
                  </div>
                  <div>
                    <strong>युवक कल्याण केंद्र:</strong><br />
                    दूरध्वनी: +91 12345 67891<br />
                    ईमेल: youth@grampanchayat.com
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

export async function generateMetadata({ params }: EducationPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Education Not Found',
      description: 'The requested education information could not be found.'
    };
  }

  return {
    title: `शिक्षण आणि युवक कोपरा - ${subdomainData.villageName}`,
    description: `शाळा, शिष्यवृत्ती, करिअर मार्गदर्शन आणि युवक उपक्रम ${subdomainData.villageName} ग्रामपंचायत`,
    keywords: `${subdomainData.villageName}, Education, Schools, Scholarships, Career Guidance, Youth Programs, Gram Panchayat, Maharashtra`,
  };
}
