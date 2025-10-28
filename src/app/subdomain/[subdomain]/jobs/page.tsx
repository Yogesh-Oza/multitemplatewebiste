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
  Laptop
} from 'lucide-react';

const prisma = new PrismaClient();

interface JobsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
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

  // Static data for Employment & Skill Development
  const jobListings = [
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

  const tenders = [
    {
      id: 1,
      title: 'रस्ते दुरुस्ती काम',
      titleEn: 'Road Repair Work',
      description: 'गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा',
      descriptionEn: 'Repair and improvement of main roads in the village',
      value: '₹2,50,000',
      lastDate: '2024-02-20',
      category: 'बांधकाम',
      categoryEn: 'Construction',
      requirements: 'लायसेंस असलेले कंत्राटदार',
      requirementsEn: 'Licensed contractor'
    },
    {
      id: 2,
      title: 'स्वच्छता अभियान',
      titleEn: 'Sanitation Campaign',
      description: 'गावातील स्वच्छता सुविधांची स्थापना आणि देखभाल',
      descriptionEn: 'Installation and maintenance of sanitation facilities',
      value: '₹1,80,000',
      lastDate: '2024-02-15',
      category: 'स्वच्छता',
      categoryEn: 'Sanitation',
      requirements: 'पर्यावरणीय अनुभव',
      requirementsEn: 'Environmental experience'
    }
  ];

  const trainingPrograms = [
    {
      id: 1,
      title: 'डिजिटल साक्षरता प्रशिक्षण',
      titleEn: 'Digital Literacy Training',
      duration: '30 दिवस',
      durationEn: '30 Days',
      fee: 'मोफत',
      feeEn: 'Free',
      description: 'कंप्युटर, इंटरनेट आणि स्मार्टफोन वापराचे प्रशिक्षण',
      descriptionEn: 'Training in computer, internet and smartphone usage',
      instructor: 'राज्य शासन',
      instructorEn: 'State Government',
      startDate: '2024-02-01',
      seats: 25,
      enrolled: 18
    },
    {
      id: 2,
      title: 'कृषी तंत्रज्ञान प्रशिक्षण',
      titleEn: 'Agricultural Technology Training',
      duration: '15 दिवस',
      durationEn: '15 Days',
      fee: '₹500',
      feeEn: '₹500',
      description: 'आधुनिक शेती पद्धती, सिंचन तंत्रज्ञान आणि पिकांची काळजी',
      descriptionEn: 'Modern farming methods, irrigation technology and crop care',
      instructor: 'कृषी विभाग',
      instructorEn: 'Agriculture Department',
      startDate: '2024-02-15',
      seats: 20,
      enrolled: 12
    }
  ];

  const fpoGroups = [
    {
      id: 1,
      name: 'ग्रामीण उत्पादक संघ',
      nameEn: 'Rural Producers Association',
      members: 45,
      established: '2020',
      activities: ['सेंद्रिय शेती', 'पशुपालन', 'हस्तकला'],
      activitiesEn: ['Organic Farming', 'Animal Husbandry', 'Handicrafts'],
      contact: '+91 98765 43210',
      email: 'fpo1@example.com',
      achievements: 'वर्षभरात ₹5 लाख उत्पन्न',
      achievementsEn: '₹5 Lakh income in one year'
    },
    {
      id: 2,
      name: 'महिला स्वयंसाहाय्य गट',
      nameEn: 'Women Self Help Group',
      members: 20,
      established: '2019',
      activities: ['कुटिर उद्योग', 'बचत गट', 'महिला सशक्तीकरण'],
      activitiesEn: ['Cottage Industry', 'Savings Group', 'Women Empowerment'],
      contact: '+91 98765 43211',
      email: 'shg2@example.com',
      achievements: '15 महिलांना रोजगार',
      achievementsEn: 'Employment for 15 women'
    }
  ];

  const localTalents = [
    {
      id: 1,
      name: 'राम पाटील',
      nameEn: 'Ram Patil',
      skill: 'वीजतज्ञ',
      skillEn: 'Electrician',
      experience: '10 वर्षे',
      experienceEn: '10 Years',
      contact: '+91 98765 43212',
      rating: 4.8,
      services: ['घरातील वीज दुरुस्ती', 'नवीन कनेक्शन', 'सौर ऊर्जा स्थापना'],
      servicesEn: ['Home electrical repair', 'New connections', 'Solar installation']
    },
    {
      id: 2,
      name: 'सीता शिंदे',
      nameEn: 'Sita Shinde',
      skill: 'टेलर',
      skillEn: 'Tailor',
      experience: '8 वर्षे',
      experienceEn: '8 Years',
      contact: '+91 98765 43213',
      rating: 4.9,
      services: ['साड्या शिवणे', 'पुरुषांचे कपडे', 'स्कूल युनिफॉर्म'],
      servicesEn: ['Saree stitching', 'Men\'s clothing', 'School uniforms']
    },
    {
      id: 3,
      name: 'विजय कांबळे',
      nameEn: 'Vijay Kambale',
      skill: 'राजमिस्त्री',
      skillEn: 'Mason',
      experience: '15 वर्षे',
      experienceEn: '15 Years',
      contact: '+91 98765 43214',
      rating: 4.7,
      services: ['घर बांधकाम', 'दुरुस्ती काम', 'टाइल्स लावणे'],
      servicesEn: ['House construction', 'Repair work', 'Tile laying']
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
          {/* Job Listings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              नोकरी संधी (Job Opportunities)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobListings.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
                      {job.requirements.map((req, index) => (
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
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                      अर्ज करा
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                      <ExternalLink className="h-4 w-4" />
                    </button>
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
              {tenders.map((tender) => (
                <div key={tender.id} className="bg-white rounded-lg shadow-md p-6">
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

                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                    निविदा पहा
                  </button>
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
              {trainingPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
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
                      <span>{program.enrolled}/{program.seats}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(program.enrolled / program.seats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm">
                    नोंदणी करा
                  </button>
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
              {fpoGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
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
                      {group.activities.map((activity, index) => (
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
                    <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm">
                      सामील व्हा
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                      <Phone className="h-4 w-4" />
                    </button>
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
              {localTalents.map((talent) => (
                <div key={talent.id} className="bg-white rounded-lg shadow-md p-6">
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
                        <span className="font-medium">{talent.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">सेवा:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {talent.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm">
                      संपर्क करा
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                      <Phone className="h-4 w-4" />
                    </button>
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
