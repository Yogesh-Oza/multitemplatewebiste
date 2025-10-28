import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { 
  TreePine, 
  Droplets, 
  Sun, 
  Recycle, 
  Leaf, 
  Wind, 
  Trash2, 
  Zap, 
  Target, 
  TrendingUp,
  Award,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Activity,
  Globe,
  Shield
} from 'lucide-react';

const prisma = new PrismaClient();

interface EnvironmentPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function EnvironmentPage({ params }: EnvironmentPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  // Static data for Environment & Sustainability
  const greenInitiatives = [
    {
      id: 1,
      title: 'वृक्षारोपण मोहीम',
      titleEn: 'Tree Plantation Campaign',
      description: 'गावातील सर्व जागी वृक्षारोपण करून हरित क्षेत्र वाढवणे',
      descriptionEn: 'Increasing green cover by planting trees throughout the village',
      status: 'चालू',
      statusEn: 'Ongoing',
      treesPlanted: 250,
      target: 500,
      participants: 45,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      impact: 'वायु प्रदूषण 15% कमी',
      impactEn: '15% reduction in air pollution',
      category: 'वृक्षारोपण',
      categoryEn: 'Tree Plantation'
    },
    {
      id: 2,
      title: 'प्लास्टिक-मुक्त अभियान',
      titleEn: 'Plastic-Free Campaign',
      description: 'प्लास्टिक वापर कमी करून पर्यावरणाचे संरक्षण',
      descriptionEn: 'Protecting environment by reducing plastic usage',
      status: 'पूर्ण',
      statusEn: 'Completed',
      treesPlanted: 0,
      target: 0,
      participants: 120,
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      impact: 'प्लास्टिक वापर 80% कमी',
      impactEn: '80% reduction in plastic usage',
      category: 'कचरा व्यवस्थापन',
      categoryEn: 'Waste Management'
    },
    {
      id: 3,
      title: 'सौर ऊर्जा योजना',
      titleEn: 'Solar Energy Scheme',
      description: 'सौर ऊर्जा वापरून नवीकरणीय ऊर्जेचा वापर',
      descriptionEn: 'Using renewable energy through solar power',
      status: 'चालू',
      statusEn: 'Ongoing',
      treesPlanted: 0,
      target: 0,
      participants: 30,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      impact: 'वीज बिल 40% कमी',
      impactEn: '40% reduction in electricity bill',
      category: 'ऊर्जा संवर्धन',
      categoryEn: 'Energy Conservation'
    }
  ];

  const wasteManagement = [
    {
      id: 1,
      type: 'कचरा वर्गीकरण',
      typeEn: 'Waste Segregation',
      description: 'घराघरात कचरा वर्गीकरणाची सुरुवात',
      descriptionEn: 'Starting waste segregation at household level',
      households: 180,
      totalHouseholds: 200,
      percentage: 90,
      status: 'यशस्वी',
      statusEn: 'Successful',
      benefits: ['पुनर्वापर वाढला', 'कचरा कमी झाला', 'पर्यावरण स्वच्छ']
    },
    {
      id: 2,
      type: 'कंपोस्ट उत्पादन',
      typeEn: 'Compost Production',
      description: 'घरगुती कचऱ्यापासून कंपोस्ट तयार करणे',
      descriptionEn: 'Producing compost from household waste',
      households: 150,
      totalHouseholds: 200,
      percentage: 75,
      status: 'चालू',
      statusEn: 'Ongoing',
      benefits: ['खताची गरज कमी', 'माती सुधारली', 'कचरा कमी']
    }
  ];

  const waterConservation = [
    {
      id: 1,
      project: 'पावसाचे पाणी साठवण',
      projectEn: 'Rainwater Harvesting',
      description: 'पावसाचे पाणी साठवून भूजल पुनर्भरण',
      descriptionEn: 'Groundwater recharge through rainwater harvesting',
      capacity: '50,000 लिटर',
      capacityEn: '50,000 Liters',
      locations: 5,
      status: 'पूर्ण',
      statusEn: 'Completed',
      impact: 'भूजल स्तर 2 मीटर वाढला',
      impactEn: 'Groundwater level increased by 2 meters'
    },
    {
      id: 2,
      project: 'नळजोडणी सुधारणा',
      projectEn: 'Water Supply Improvement',
      description: 'पाणीपुरवठा व्यवस्था सुधारणे आणि गळती थांबवणे',
      descriptionEn: 'Improving water supply system and stopping leaks',
      capacity: '100% कव्हरेज',
      capacityEn: '100% Coverage',
      locations: 1,
      status: 'चालू',
      statusEn: 'Ongoing',
      impact: 'पाणी गळती 60% कमी',
      impactEn: '60% reduction in water leakage'
    }
  ];

  const environmentalMetrics = [
    {
      id: 1,
      metric: 'वृक्षसंख्या',
      metricEn: 'Tree Count',
      current: 1250,
      target: 2000,
      unit: 'झाडे',
      unitEn: 'Trees',
      progress: 62.5,
      color: 'green',
      description: 'गावातील एकूण वृक्षसंख्या',
      descriptionEn: 'Total number of trees in the village'
    },
    {
      id: 2,
      metric: 'स्वच्छता टक्केवारी',
      metricEn: 'Sanitation Percentage',
      current: 85,
      target: 100,
      unit: '%',
      unitEn: '%',
      progress: 85,
      color: 'blue',
      description: 'स्वच्छतागृह कव्हरेज',
      descriptionEn: 'Toilet coverage percentage'
    },
    {
      id: 3,
      metric: 'कचरा वर्गीकरण',
      metricEn: 'Waste Segregation',
      current: 90,
      target: 100,
      unit: '%',
      unitEn: '%',
      progress: 90,
      color: 'purple',
      description: 'घरांमध्ये कचरा वर्गीकरण',
      descriptionEn: 'Waste segregation in households'
    },
    {
      id: 4,
      metric: 'सौर ऊर्जा वापर',
      metricEn: 'Solar Energy Usage',
      current: 35,
      target: 80,
      unit: '%',
      unitEn: '%',
      progress: 43.75,
      color: 'yellow',
      description: 'सौर ऊर्जा वापर टक्केवारी',
      descriptionEn: 'Percentage of solar energy usage'
    }
  ];

  const adoptATree = [
    {
      id: 1,
      treeName: 'नीम',
      treeNameEn: 'Neem',
      location: 'गाव मध्यभागी',
      locationEn: 'Village Center',
      adoptedBy: 'राम पाटील',
      adoptedByEn: 'Ram Patil',
      plantedDate: '2024-01-15',
      status: 'वाढत आहे',
      statusEn: 'Growing',
      height: '2.5 फूट',
      heightEn: '2.5 Feet',
      sponsor: '₹500',
      careInstructions: 'दररोज पाणी द्या, महिन्यातून एकदा खत द्या'
    },
    {
      id: 2,
      treeName: 'आंबा',
      treeNameEn: 'Mango',
      location: 'शाळेजवळ',
      locationEn: 'Near School',
      adoptedBy: 'प्रिया शिंदे',
      adoptedByEn: 'Priya Shinde',
      plantedDate: '2024-01-20',
      status: 'वाढत आहे',
      statusEn: 'Growing',
      height: '3.2 फूट',
      heightEn: '3.2 Feet',
      sponsor: '₹800',
      careInstructions: 'दररोज पाणी द्या, तोडणी करा, कीटकनाशक वापरा'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'विश्व पर्यावरण दिन',
      titleEn: 'World Environment Day',
      date: '2024-06-05',
      time: '9:00 AM',
      location: 'ग्रामपंचायत कार्यालय',
      locationEn: 'Gram Panchayat Office',
      description: 'पर्यावरण संवर्धनावर व्याख्यान आणि वृक्षारोपण',
      descriptionEn: 'Lecture on environmental conservation and tree plantation',
      participants: 50,
      type: 'कार्यक्रम',
      typeEn: 'Event'
    },
    {
      id: 2,
      title: 'स्वच्छता अभियान',
      titleEn: 'Cleanliness Campaign',
      date: '2024-02-15',
      time: '7:00 AM',
      location: 'गाव सर्वत्र',
      locationEn: 'Throughout Village',
      description: 'गावातील सर्व जागी स्वच्छता करणे',
      descriptionEn: 'Cleaning all areas of the village',
      participants: 100,
      type: 'अभियान',
      typeEn: 'Campaign'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                पर्यावरण आणि शाश्वत विकास
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                हरित उपक्रम, कचरा व्यवस्थापन आणि पर्यावरण संवर्धन
              </p>
              <p className="text-lg text-green-200 mt-2">
                Environment & Sustainability - Green Initiatives, Waste Management & Conservation
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Environmental Metrics Dashboard */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-600" />
              पर्यावरणीय निर्देशक (Environmental Metrics)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {environmentalMetrics.map((metric) => (
                <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                      <TreePine className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.current.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{metric.unit}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {metric.metric}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {metric.description}
                  </p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>प्रगती</span>
                      <span>{metric.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(metric.progress)}`}
                        style={{ width: `${metric.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    लक्ष्य: {metric.target.toLocaleString()} {metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Green Initiatives */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              हरित उपक्रम (Green Initiatives)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {greenInitiatives.map((initiative) => (
                <div key={initiative.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {initiative.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      initiative.status === 'पूर्ण' ? 'bg-green-100 text-green-800' :
                      initiative.status === 'चालू' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {initiative.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {initiative.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {initiative.treesPlanted}
                      </div>
                      <div className="text-sm text-gray-600">झाडे लावली</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {initiative.participants}
                      </div>
                      <div className="text-sm text-gray-600">सहभागी</div>
                    </div>
                  </div>

                  {initiative.treesPlanted > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>प्रगती</span>
                        <span>{Math.round((initiative.treesPlanted / initiative.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(initiative.treesPlanted / initiative.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">सुरुवात:</span>
                      <span className="font-medium">{new Date(initiative.startDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">शेवट:</span>
                      <span className="font-medium">{new Date(initiative.endDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">परिणाम:</span>
                      <span className="font-medium text-green-600">{initiative.impact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {initiative.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Management */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Recycle className="h-6 w-6 text-purple-600" />
              कचरा व्यवस्थापन (Waste Management)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wasteManagement.map((waste) => (
                <div key={waste.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {waste.type}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{waste.typeEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {waste.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>सहभागी घरे</span>
                      <span>{waste.households}/{waste.totalHouseholds}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${waste.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {waste.percentage}% पूर्ण
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">फायदे:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {waste.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      waste.status === 'यशस्वी' ? 'bg-green-100 text-green-800' :
                      waste.status === 'चालू' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {waste.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Conservation */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              पाणी संवर्धन (Water Conservation)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {waterConservation.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.project}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{project.projectEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">क्षमता:</span>
                      <span className="font-medium">{project.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">स्थाने:</span>
                      <span className="font-medium">{project.locations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">परिणाम:</span>
                      <span className="font-medium text-blue-600">{project.impact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'पूर्ण' ? 'bg-green-100 text-green-800' :
                      project.status === 'चालू' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adopt a Tree */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-600" />
              झाड प्रायोजित करा (Adopt a Tree)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adoptATree.map((tree) => (
                <div key={tree.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <TreePine className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tree.treeName}</h3>
                      <p className="text-sm text-gray-600">{tree.treeNameEn}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">स्थान:</span>
                      <span className="font-medium">{tree.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">प्रायोजक:</span>
                      <span className="font-medium">{tree.adoptedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">लावण्याची तारीख:</span>
                      <span className="font-medium">{new Date(tree.plantedDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">उंची:</span>
                      <span className="font-medium">{tree.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">प्रायोजन रक्कम:</span>
                      <span className="font-medium text-green-600">{tree.sponsor}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">काळजी सूचना:</h4>
                    <p className="text-sm text-gray-600">{tree.careInstructions}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {tree.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-600" />
              आगामी कार्यक्रम (Upcoming Events)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{event.titleEn}</p>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">तारीख:</span>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">वेळ:</span>
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">स्थान:</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">सहभागी:</span>
                      <span className="font-medium">{event.participants}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              अधिक माहितीसाठी संपर्क करा
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>पर्यावरण विभाग:</strong><br />
                दूरध्वनी: +91 12345 67890<br />
                ईमेल: environment@grampanchayat.com
              </div>
              <div>
                <strong>हरित कार्यक्रम समन्वयक:</strong><br />
                दूरध्वनी: +91 12345 67891<br />
                ईमेल: green@grampanchayat.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubdomainValidator>
  );
}

export async function generateMetadata({ params }: EnvironmentPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Environment Not Found',
      description: 'The requested environment information could not be found.'
    };
  }

  return {
    title: `पर्यावरण आणि शाश्वत विकास - ${subdomainData.villageName}`,
    description: `हरित उपक्रम, कचरा व्यवस्थापन आणि पर्यावरण संवर्धन ${subdomainData.villageName} ग्रामपंचायत`,
    keywords: `${subdomainData.villageName}, Environment, Sustainability, Green Initiatives, Waste Management, Conservation, Gram Panchayat, Maharashtra`,
  };
}
