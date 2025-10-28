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
  Lightbulb
} from 'lucide-react';

const prisma = new PrismaClient();

interface EducationPageProps {
  params: Promise<{
    subdomain: string;
  }>;
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

  // Static data for Education & Youth Corner
  const schools = [
    {
      id: 1,
      name: 'श्री गणपती प्राथमिक शाळा',
      nameEn: 'Shri Ganpati Primary School',
      type: 'प्राथमिक शाळा',
      typeEn: 'Primary School',
      students: 156,
      teachers: 8,
      classes: '1-7',
      established: '1985',
      achievements: ['100% उत्तीर्णता', 'स्वच्छता पुरस्कार', 'सर्वोत्कृष्ट शिक्षक पुरस्कार'],
      achievementsEn: ['100% Pass Rate', 'Sanitation Award', 'Best Teacher Award'],
      facilities: ['कंप्युटर लॅब', 'पुस्तकालय', 'खेळाचे मैदान', 'स्वच्छतागृह'],
      facilitiesEn: ['Computer Lab', 'Library', 'Playground', 'Toilets'],
      contact: '+91 98765 43210',
      address: 'गाव मध्यभागी, तालुका, जिल्हा',
      addressEn: 'Village Center, Taluka, District'
    },
    {
      id: 2,
      name: 'महात्मा गांधी माध्यमिक शाळा',
      nameEn: 'Mahatma Gandhi Secondary School',
      type: 'माध्यमिक शाळा',
      typeEn: 'Secondary School',
      students: 89,
      teachers: 12,
      classes: '8-10',
      established: '1992',
      achievements: ['राज्यस्तरीय क्रीडा पुरस्कार', 'विज्ञान प्रदर्शन पुरस्कार'],
      achievementsEn: ['State Level Sports Award', 'Science Exhibition Award'],
      facilities: ['विज्ञान प्रयोगशाळा', 'कंप्युटर लॅब', 'पुस्तकालय', 'खेळाचे मैदान'],
      facilitiesEn: ['Science Laboratory', 'Computer Lab', 'Library', 'Playground'],
      contact: '+91 98765 43211',
      address: 'गाव पूर्व भाग, तालुका, जिल्हा',
      addressEn: 'Village East, Taluka, District'
    }
  ];

  const scholarships = [
    {
      id: 1,
      name: 'मुख्यमंत्री शिष्यवृत्ती योजना',
      nameEn: 'Chief Minister Scholarship Scheme',
      amount: '₹5,000 - ₹15,000',
      eligibility: '10वी/12वी 80% पेक्षा जास्त गुण',
      eligibilityEn: '10th/12th with 80%+ marks',
      lastDate: '2024-03-15',
      description: 'उत्कृष्ट विद्यार्थ्यांसाठी वार्षिक शिष्यवृत्ती',
      descriptionEn: 'Annual scholarship for meritorious students',
      category: 'शासकीय',
      categoryEn: 'Government'
    },
    {
      id: 2,
      name: 'आदिवासी विद्यार्थी शिष्यवृत्ती',
      nameEn: 'Tribal Student Scholarship',
      amount: '₹3,000 - ₹8,000',
      eligibility: 'आदिवासी समुदाय, 60% पेक्षा जास्त गुण',
      eligibilityEn: 'Tribal community, 60%+ marks',
      lastDate: '2024-03-20',
      description: 'आदिवासी विद्यार्थ्यांसाठी विशेष शिष्यवृत्ती',
      descriptionEn: 'Special scholarship for tribal students',
      category: 'शासकीय',
      categoryEn: 'Government'
    },
    {
      id: 3,
      name: 'महिला शिक्षण प्रोत्साहन',
      nameEn: 'Women Education Encouragement',
      amount: '₹2,000 - ₹5,000',
      eligibility: 'महिला विद्यार्थी, 70% पेक्षा जास्त गुण',
      eligibilityEn: 'Female students, 70%+ marks',
      lastDate: '2024-03-25',
      description: 'महिला शिक्षणासाठी प्रोत्साहन रक्कम',
      descriptionEn: 'Encouragement amount for women education',
      category: 'शासकीय',
      categoryEn: 'Government'
    }
  ];

  const studentAchievements = [
    {
      id: 1,
      name: 'प्रिया पाटील',
      nameEn: 'Priya Patil',
      class: '10वी',
      classEn: '10th',
      achievement: 'राज्यस्तरीय गणित स्पर्धा - प्रथम स्थान',
      achievementEn: 'State Level Math Competition - 1st Position',
      year: '2024',
      category: 'शैक्षणिक',
      categoryEn: 'Academic',
      school: 'महात्मा गांधी माध्यमिक शाळा',
      schoolEn: 'Mahatma Gandhi Secondary School'
    },
    {
      id: 2,
      name: 'राजेश शिंदे',
      nameEn: 'Rajesh Shinde',
      class: '9वी',
      classEn: '9th',
      achievement: 'जिल्हा स्तरीय क्रिकेट स्पर्धा - सर्वोत्कृष्ट खेळाडू',
      achievementEn: 'District Level Cricket Competition - Best Player',
      year: '2024',
      category: 'क्रीडा',
      categoryEn: 'Sports',
      school: 'श्री गणपती प्राथमिक शाळा',
      schoolEn: 'Shri Ganpati Primary School'
    },
    {
      id: 3,
      name: 'सुनीता कांबळे',
      nameEn: 'Sunita Kambale',
      class: '8वी',
      classEn: '8th',
      achievement: 'विज्ञान प्रदर्शन - सर्वोत्कृष्ट प्रकल्प',
      achievementEn: 'Science Exhibition - Best Project',
      year: '2024',
      category: 'विज्ञान',
      categoryEn: 'Science',
      school: 'महात्मा गांधी माध्यमिक शाळा',
      schoolEn: 'Mahatma Gandhi Secondary School'
    }
  ];

  const careerGuidance = [
    {
      id: 1,
      title: 'इंजिनिअरिंग क्षेत्रातील संधी',
      titleEn: 'Opportunities in Engineering Field',
      description: 'विविध इंजिनिअरिंग शाखांमध्ये करिअर मार्गदर्शन',
      descriptionEn: 'Career guidance in various engineering branches',
      duration: '2 तास',
      durationEn: '2 Hours',
      date: '2024-02-15',
      time: '10:00 AM',
      speaker: 'डॉ. विजय पाटील (IIT मुंबई)',
      speakerEn: 'Dr. Vijay Patil (IIT Mumbai)',
      type: 'व्याख्यान',
      typeEn: 'Lecture'
    },
    {
      id: 2,
      title: 'वैद्यकीय क्षेत्रातील करिअर',
      titleEn: 'Career in Medical Field',
      description: 'वैद्यकीय शिक्षण आणि करिअर संधी',
      descriptionEn: 'Medical education and career opportunities',
      duration: '1.5 तास',
      durationEn: '1.5 Hours',
      date: '2024-02-20',
      time: '2:00 PM',
      speaker: 'डॉ. सुनीता शर्मा (AIIMS)',
      speakerEn: 'Dr. Sunita Sharma (AIIMS)',
      type: 'व्याख्यान',
      typeEn: 'Lecture'
    },
    {
      id: 3,
      title: 'सरकारी नोकरी तयारी',
      titleEn: 'Government Job Preparation',
      description: 'UPSC, MPSC आणि इतर सरकारी परीक्षांची तयारी',
      descriptionEn: 'Preparation for UPSC, MPSC and other government exams',
      duration: '3 तास',
      durationEn: '3 Hours',
      date: '2024-02-25',
      time: '9:00 AM',
      speaker: 'श्री. अमित जोशी (UPSC टॉपर)',
      speakerEn: 'Shri. Amit Joshi (UPSC Topper)',
      type: 'वर्कशॉप',
      typeEn: 'Workshop'
    }
  ];

  const nssActivities = [
    {
      id: 1,
      title: 'स्वच्छता अभियान',
      titleEn: 'Cleanliness Campaign',
      date: '2024-02-10',
      participants: 25,
      description: 'गावातील स्वच्छता सुधारणा आणि जागरूकता निर्माण',
      descriptionEn: 'Village cleanliness improvement and awareness creation',
      impact: '50 किलो कचरा गोळा केला',
      impactEn: '50 kg waste collected'
    },
    {
      id: 2,
      title: 'वृक्षारोपण कार्यक्रम',
      titleEn: 'Tree Plantation Program',
      date: '2024-01-15',
      participants: 30,
      description: 'गावातील वृक्षारोपण आणि पर्यावरण संवर्धन',
      descriptionEn: 'Tree plantation and environmental conservation in village',
      impact: '100 झाडे लावली',
      impactEn: '100 trees planted'
    },
    {
      id: 3,
      title: 'शिक्षण जागरूकता',
      titleEn: 'Education Awareness',
      date: '2024-01-20',
      participants: 20,
      description: 'मुलांच्या शिक्षणासाठी पालकांना जागरूक करणे',
      descriptionEn: 'Creating awareness among parents for children\'s education',
      impact: '15 कुटुंबांना शिक्षणाचे महत्त्व समजावले',
      impactEn: 'Educated 15 families about importance of education'
    }
  ];

  const youthStories = [
    {
      id: 1,
      name: 'अमित पाटील',
      nameEn: 'Amit Patil',
      age: 22,
      story: 'गावातील पहिला इंजिनिअर बनला. आता मुंबईत नोकरी करतो आणि गावाच्या विकासासाठी मदत करतो.',
      storyEn: 'Became the first engineer from the village. Now works in Mumbai and helps in village development.',
      achievement: 'IIT मुंबईत प्रवेश',
      achievementEn: 'Admission to IIT Mumbai',
      current: 'सॉफ्टवेअर इंजिनिअर, मुंबई',
      currentEn: 'Software Engineer, Mumbai'
    },
    {
      id: 2,
      name: 'प्रिया शिंदे',
      nameEn: 'Priya Shinde',
      age: 20,
      story: 'गावातील पहिली डॉक्टर बनली. आता स्थानिक आरोग्य केंद्रात काम करते.',
      storyEn: 'Became the first doctor from the village. Now works at local health center.',
      achievement: 'MBBS पूर्ण केले',
      achievementEn: 'Completed MBBS',
      current: 'डॉक्टर, स्थानिक आरोग्य केंद्र',
      currentEn: 'Doctor, Local Health Center'
    }
  ];

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
          {/* Schools Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <School className="h-6 w-6 text-purple-600" />
              शाळा (Schools)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schools.map((school) => (
                <div key={school.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
                      {school.facilities.map((facility, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">उपलब्धी:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {school.achievements.map((achievement, index) => (
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
              {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="bg-white rounded-lg shadow-md p-6">
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

                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                    अर्ज करा
                  </button>
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
              {studentAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6">
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
              {careerGuidance.map((guidance) => (
                <div key={guidance.id} className="bg-white rounded-lg shadow-md p-6">
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

                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                    नोंदणी करा
                  </button>
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
              {nssActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
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
              {youthStories.map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-md p-6">
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
