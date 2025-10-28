import { prisma } from '@/lib/prisma';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { 
  Users, 
  Home, 
  GraduationCap, 
  Droplets, 
  Zap, 
  TreePine, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Calendar,
  Laptop,
  Sun
} from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { subdomain } = await params;

  // Fetch dashboard data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      dashboardMetrics: true
    }
  });

  if (!subdomainData) {
    return <div>Subdomain not found</div>;
  }

  // Get comprehensive statistics
  const [
    projectsStats,
    complaintsStats,
    announcementsCount,
    facilitiesCount,
    departmentsCount,
    governmentSchemesCount,
    culturalHeritageCount,
    programsCount,
    galleryCount
  ] = await Promise.all([
    // Projects statistics
    prisma.project.groupBy({
      by: ['status'],
      where: { subdomainId: subdomainData.id },
      _count: { status: true }
    }),
    // Complaints statistics
    prisma.complaint.groupBy({
      by: ['status'],
      where: { subdomainId: subdomainData.id },
      _count: { status: true }
    }),
    // Content counts
    prisma.announcement.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.facility.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.department.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.governmentScheme.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.culturalHeritage.count({ where: { subdomainId: subdomainData.id, isActive: true } }),
    prisma.program.count({ where: { subdomainId: subdomainData.id } }),
    prisma.gallery.count({ where: { subdomainId: subdomainData.id, isActive: true } })
  ]);

  // Calculate project statistics
  const completedProjects = projectsStats.find(p => p.status === 'completed')?._count.status || 0;
  const ongoingProjects = projectsStats.find(p => p.status === 'ongoing')?._count.status || 0;
  const upcomingProjects = projectsStats.find(p => p.status === 'upcoming')?._count.status || 0;
  const totalProjects = completedProjects + ongoingProjects + upcomingProjects;

  // Calculate complaint statistics
  const resolvedComplaints = complaintsStats.find(c => c.status === 'resolved')?._count.status || 0;
  const pendingComplaints = complaintsStats.find(c => c.status === 'pending')?._count.status || 0;
  const inProgressComplaints = complaintsStats.find(c => c.status === 'in_progress')?._count.status || 0;
  const totalComplaints = resolvedComplaints + pendingComplaints + inProgressComplaints;

  // Mock data for KPIs (in real implementation, this would come from actual data)
  const kpiData = {
    population: 1958,
    literacyRate: 78.5,
    sanitationCoverage: 85.2,
    waterSupplyCoverage: 92.1,
    electricityCoverage: 98.7,
    roadConnectivity: 88.3,
    digitalLiteracy: 45.6,
    womenParticipation: 62.4,
    youthEngagement: 38.9,
    environmentalInitiatives: 12
  };

  // Ward-wise comparison data
  const wardData = [
    {
      id: 1,
      name: 'वॉर्ड 1',
      nameEn: 'Ward 1',
      population: 450,
      households: 95,
      sanitation: 92,
      waterSupply: 88,
      electricity: 95,
      projects: 8,
      complaints: 12,
      resolved: 10
    },
    {
      id: 2,
      name: 'वॉर्ड 2',
      nameEn: 'Ward 2',
      population: 380,
      households: 78,
      sanitation: 85,
      waterSupply: 92,
      electricity: 98,
      projects: 6,
      complaints: 8,
      resolved: 7
    },
    {
      id: 3,
      name: 'वॉर्ड 3',
      nameEn: 'Ward 3',
      population: 520,
      households: 110,
      sanitation: 78,
      waterSupply: 85,
      electricity: 90,
      projects: 10,
      complaints: 15,
      resolved: 12
    },
    {
      id: 4,
      name: 'वॉर्ड 4',
      nameEn: 'Ward 4',
      population: 420,
      households: 88,
      sanitation: 88,
      waterSupply: 90,
      electricity: 92,
      projects: 7,
      complaints: 9,
      resolved: 8
    }
  ];

  // Top 5 achievements
  const topAchievements = [
    {
      id: 1,
      title: '100% स्वच्छता कव्हरेज',
      titleEn: '100% Sanitation Coverage',
      description: 'सर्व घरांमध्ये स्वच्छतागृहांची स्थापना',
      descriptionEn: 'Toilet installation in all households',
      impact: 'स्वच्छता सुविधा वाढल्या',
      impactEn: 'Sanitation facilities increased',
      year: '2024',
      category: 'स्वच्छता',
      categoryEn: 'Sanitation',
      icon: 'CheckCircle'
    },
    {
      id: 2,
      title: 'डिजिटल साक्षरता 80%',
      titleEn: '80% Digital Literacy',
      description: 'गावातील 80% लोकांना डिजिटल साक्षरता',
      descriptionEn: '80% of villagers achieved digital literacy',
      impact: 'डिजिटल सेवा वापर वाढला',
      impactEn: 'Increased usage of digital services',
      year: '2024',
      category: 'शिक्षण',
      categoryEn: 'Education',
      icon: 'Laptop'
    },
    {
      id: 3,
      title: 'सौर ऊर्जा योजना',
      titleEn: 'Solar Energy Scheme',
      description: '50 घरांमध्ये सौर ऊर्जा स्थापना',
      descriptionEn: 'Solar energy installation in 50 houses',
      impact: 'वीज बिल 40% कमी',
      impactEn: '40% reduction in electricity bill',
      year: '2024',
      category: 'ऊर्जा',
      categoryEn: 'Energy',
      icon: 'Sun'
    },
    {
      id: 4,
      title: 'वृक्षारोपण 500 झाडे',
      titleEn: '500 Trees Planted',
      description: 'गावातील सर्व जागी 500 झाडे लावली',
      descriptionEn: '500 trees planted throughout the village',
      impact: 'हरित क्षेत्र वाढले',
      impactEn: 'Green cover increased',
      year: '2024',
      category: 'पर्यावरण',
      categoryEn: 'Environment',
      icon: 'TreePine'
    },
    {
      id: 5,
      title: 'महिला सशक्तीकरण',
      titleEn: 'Women Empowerment',
      description: '25 महिला स्वयंसाहाय्य गट स्थापन',
      descriptionEn: '25 women self-help groups established',
      impact: 'महिला आर्थिक सक्षम',
      impactEn: 'Women economically empowered',
      year: '2024',
      category: 'सामाजिक',
      categoryEn: 'Social',
      icon: 'Users'
    }
  ];

  const kpiCards = [
    {
      title: 'लोकसंख्या',
      titleEn: 'Population',
      value: kpiData.population.toLocaleString('en-IN'),
      icon: Users,
      color: 'blue',
      description: 'एकूण लोकसंख्या',
      descriptionEn: 'Total Population'
    },
    {
      title: 'साक्षरता दर',
      titleEn: 'Literacy Rate',
      value: `${kpiData.literacyRate}%`,
      icon: GraduationCap,
      color: 'green',
      description: 'साक्षरता टक्केवारी',
      descriptionEn: 'Literacy Percentage'
    },
    {
      title: 'स्वच्छता कव्हरेज',
      titleEn: 'Sanitation Coverage',
      value: `${kpiData.sanitationCoverage}%`,
      icon: CheckCircle,
      color: 'emerald',
      description: 'स्वच्छतागृह कव्हरेज',
      descriptionEn: 'Toilet Coverage'
    },
    {
      title: 'पाणीपुरवठा',
      titleEn: 'Water Supply',
      value: `${kpiData.waterSupplyCoverage}%`,
      icon: Droplets,
      color: 'blue',
      description: 'नळजोडणी कव्हरेज',
      descriptionEn: 'Water Connection Coverage'
    },
    {
      title: 'वीजपुरवठा',
      titleEn: 'Electricity',
      value: `${kpiData.electricityCoverage}%`,
      icon: Zap,
      color: 'yellow',
      description: 'वीज कनेक्शन',
      descriptionEn: 'Electricity Connection'
    },
    {
      title: 'रस्ते जोडणी',
      titleEn: 'Road Connectivity',
      value: `${kpiData.roadConnectivity}%`,
      icon: TrendingUp,
      color: 'orange',
      description: 'रस्त्यांची स्थिती',
      descriptionEn: 'Road Infrastructure'
    }
  ];

  const progressCards = [
    {
      title: 'डिजिटल साक्षरता',
      titleEn: 'Digital Literacy',
      value: kpiData.digitalLiteracy,
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'महिला सहभाग',
      titleEn: 'Women Participation',
      value: kpiData.womenParticipation,
      icon: Users,
      color: 'pink'
    },
    {
      title: 'युवक सहभाग',
      titleEn: 'Youth Engagement',
      value: kpiData.youthEngagement,
      icon: Target,
      color: 'indigo'
    },
    {
      title: 'पर्यावरण उपक्रम',
      titleEn: 'Environment Initiatives',
      value: kpiData.environmentalInitiatives,
      icon: TreePine,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      emerald: 'bg-emerald-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      pink: 'bg-pink-500 text-white',
      indigo: 'bg-indigo-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                माझे गाव, माझी प्रगती
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                {subdomainData.villageName} ग्रामपंचायत - विकास आणि प्रगतीचा डॅशबोर्ड
              </p>
              <p className="text-lg text-green-200 mt-2">
                My Village, My Progress - {subdomainData.villageNameEn} Gram Panchayat Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Key Performance Indicators */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              मुख्य निर्देशक (Key Performance Indicators)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpiCards.map((kpi, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(kpi.color)}`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                      <div className="text-sm text-gray-600">{kpi.titleEn}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {kpi.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {kpi.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="h-6 w-6 text-blue-600" />
              प्रगती निर्देशक (Progress Indicators)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {progressCards.map((progress, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${getColorClasses(progress.color)}`}>
                      <progress.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{progress.title}</h3>
                      <p className="text-sm text-gray-600">{progress.titleEn}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>प्रगती</span>
                      <span>{progress.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(progress.value)}`}
                        style={{ width: `${progress.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Statistics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              सामग्री सांख्यिकी (Content Statistics)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalProjects}</div>
                <div className="text-sm text-gray-600 mb-1">एकूण प्रकल्प</div>
                <div className="text-xs text-gray-500">Total Projects</div>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    पूर्ण: {completedProjects}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    चालू: {ongoingProjects}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{announcementsCount}</div>
                <div className="text-sm text-gray-600 mb-1">घोषणा</div>
                <div className="text-xs text-gray-500">Announcements</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{facilitiesCount}</div>
                <div className="text-sm text-gray-600 mb-1">सुविधा</div>
                <div className="text-xs text-gray-500">Facilities</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{totalComplaints}</div>
                <div className="text-sm text-gray-600 mb-1">तक्रारी</div>
                <div className="text-xs text-gray-500">Complaints</div>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    सोडविले: {resolvedComplaints}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    प्रलंबित: {pendingComplaints}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ward-wise Comparison */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              वॉर्डनिहाय तुलना (Ward-wise Comparison)
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">वॉर्ड</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">लोकसंख्या</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">घरे</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्वच्छता</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">पाणी</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">वीज</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">प्रकल्प</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">तक्रारी</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wardData.map((ward) => (
                      <tr key={ward.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ward.name}</div>
                          <div className="text-sm text-gray-500">{ward.nameEn}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ward.population.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ward.households}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${ward.sanitation}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{ward.sanitation}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${ward.waterSupply}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{ward.waterSupply}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${ward.electricity}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{ward.electricity}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ward.projects}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ward.complaints}</div>
                          <div className="text-xs text-green-600">सोडविले: {ward.resolved}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top 5 Achievements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              वर्षातील टॉप ५ उपलब्धी (Top 5 Achievements of the Year)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topAchievements.map((achievement, index) => (
                <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6 relative">
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      {achievement.icon === 'CheckCircle' && <CheckCircle className="h-6 w-6 text-yellow-600" />}
                      {achievement.icon === 'Laptop' && <Laptop className="h-6 w-6 text-yellow-600" />}
                      {achievement.icon === 'Sun' && <Sun className="h-6 w-6 text-yellow-600" />}
                      {achievement.icon === 'TreePine' && <TreePine className="h-6 w-6 text-yellow-600" />}
                      {achievement.icon === 'Users' && <Users className="h-6 w-6 text-yellow-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.titleEn}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">परिणाम:</h4>
                    <p className="text-sm text-green-600">{achievement.impact}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      {achievement.category}
                    </span>
                    <span className="text-xs text-gray-500">{achievement.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-600" />
              अलीकडील क्रियाकलाप (Recent Activity)
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">नवीन प्रकल्प सुरू</p>
                    <p className="text-sm text-gray-600">रस्ते दुरुस्ती प्रकल्प सुरू झाला</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 दिवसांपूर्वी</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">ग्रामसभा बैठक</p>
                    <p className="text-sm text-gray-600">मासिक ग्रामसभा बैठक नियोजित</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">1 आठवड्यापूर्वी</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">नवीन घोषणा</p>
                    <p className="text-sm text-gray-600">स्वच्छता अभियान घोषणा प्रकाशित</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">3 दिवसांपूर्वी</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </SubdomainValidator>
  );
}
