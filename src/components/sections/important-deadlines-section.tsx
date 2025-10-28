'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Vote, 
  Users, 
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface ImportantDeadline {
  id: string;
  title: string;
  titleEn: string;
  type: 'tax' | 'election' | 'camp' | 'application' | 'meeting' | 'other';
  deadline: string;
  time: string;
  description: string;
  descriptionEn: string;
  instructions: string[];
  instructionsEn: string[];
  documents: {
    name: string;
    nameEn: string;
    url: string;
    required: boolean;
  }[];
  contactInfo: {
    name: string;
    nameEn: string;
    phone: string;
    email: string;
  };
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'upcoming' | 'due-soon' | 'overdue' | 'completed';
  lastUpdated: string;
}

interface ImportantDeadlinesSectionProps {
  deadlines?: ImportantDeadline[];
}

export default function ImportantDeadlinesSection({ deadlines = [] }: ImportantDeadlinesSectionProps) {
  // Demo data for when no deadlines are available
  const demoDeadlines: ImportantDeadline[] = [
    {
      id: 'deadline-1',
      title: 'संपत्ती कर भरणा',
      titleEn: 'Property Tax Payment',
      type: 'tax',
      deadline: '2024-12-31',
      time: '11:59 PM',
      description: 'वर्ष २०२४-२५ चा संपत्ती कर भरण्याची अंतिम मुदत',
      descriptionEn: 'Final deadline for payment of property tax for year 2024-25',
      instructions: [
        'ऑनलाइन किंवा कार्यालयात जाऊन कर भरा',
        'कर रसीद जतन करा',
        'देरीच्या बाबतीत दंड भरावा लागेल',
        'अधिक माहितीसाठी कार्यालयात संपर्क करा'
      ],
      instructionsEn: [
        'Pay tax online or visit office',
        'Keep tax receipt safe',
        'Late payment will attract penalty',
        'Contact office for more information'
      ],
      documents: [
        {
          name: 'कर फॉर्म',
          nameEn: 'Tax Form',
          url: '/documents/property-tax-form.pdf',
          required: true
        },
        {
          name: 'दर सारणी',
          nameEn: 'Rate Chart',
          url: '/documents/tax-rate-chart.pdf',
          required: false
        }
      ],
      contactInfo: {
        name: 'कर अधिकारी',
        nameEn: 'Tax Officer',
        phone: '+91-XXXX-XXXXXX',
        email: 'tax@grampanchayat.gov.in'
      },
      priority: 'urgent',
      status: 'due-soon',
      lastUpdated: '2024-12-01'
    },
    {
      id: 'deadline-2',
      title: 'ग्रामपंचायत निवडणुका',
      titleEn: 'Gram Panchayat Elections',
      type: 'election',
      deadline: '2025-01-15',
      time: '05:00 PM',
      description: 'ग्रामपंचायत निवडणुकीची मतदान तारीख',
      descriptionEn: 'Voting date for Gram Panchayat elections',
      instructions: [
        'मतदान केंद्रावर जाऊन मतदान करा',
        'मतदान कार्ड आणि आधार कार्ड घेऊन जा',
        'मतदान वेळ: सकाळी ७:०० ते संध्याकाळी ५:००',
        'मतदान केंद्राची माहिती पूर्वी तपासा'
      ],
      instructionsEn: [
        'Visit polling station and cast your vote',
        'Bring voter ID and Aadhaar card',
        'Voting time: 7:00 AM to 5:00 PM',
        'Check polling station information in advance'
      ],
      documents: [
        {
          name: 'मतदान कार्ड',
          nameEn: 'Voter ID',
          url: '/documents/voter-id.pdf',
          required: true
        },
        {
          name: 'आधार कार्ड',
          nameEn: 'Aadhaar Card',
          url: '/documents/aadhaar-card.pdf',
          required: true
        }
      ],
      contactInfo: {
        name: 'निवडणूक अधिकारी',
        nameEn: 'Election Officer',
        phone: '+91-XXXX-XXXXXX',
        email: 'election@grampanchayat.gov.in'
      },
      priority: 'high',
      status: 'upcoming',
      lastUpdated: '2024-12-01'
    },
    {
      id: 'deadline-3',
      title: 'स्वास्थ्य शिबिर',
      titleEn: 'Health Camp',
      type: 'camp',
      deadline: '2024-12-20',
      time: '09:00 AM - 04:00 PM',
      description: 'मोफत स्वास्थ्य तपासणी शिबिर',
      descriptionEn: 'Free health checkup camp',
      instructions: [
        'सकाळी ९:०० वाजता शिबिर सुरू होईल',
        'आधार कार्ड आणि रुग्णालय कार्ड घेऊन या',
        'पोट रिकामे राहून या',
        'सर्व वयोगटातील लोक येऊ शकतात'
      ],
      instructionsEn: [
        'Camp will start at 9:00 AM',
        'Bring Aadhaar card and hospital card',
        'Come on empty stomach',
        'People of all age groups can attend'
      ],
      documents: [
        {
          name: 'आधार कार्ड',
          nameEn: 'Aadhaar Card',
          url: '/documents/aadhaar-card.pdf',
          required: true
        },
        {
          name: 'रुग्णालय कार्ड',
          nameEn: 'Hospital Card',
          url: '/documents/hospital-card.pdf',
          required: false
        }
      ],
      contactInfo: {
        name: 'स्वास्थ्य अधिकारी',
        nameEn: 'Health Officer',
        phone: '+91-XXXX-XXXXXX',
        email: 'health@grampanchayat.gov.in'
      },
      priority: 'medium',
      status: 'upcoming',
      lastUpdated: '2024-12-01'
    },
    {
      id: 'deadline-4',
      title: 'युवक मंडळ सदस्यत्व अर्ज',
      titleEn: 'Youth Club Membership Application',
      type: 'application',
      deadline: '2024-12-25',
      time: '05:00 PM',
      description: 'युवक मंडळाचे सदस्य होण्यासाठी अर्ज',
      descriptionEn: 'Application for Youth Club membership',
      instructions: [
        'अर्ज फॉर्म भरून सबमिट करा',
        'आवश्यक कागदपत्रे जोडा',
        'अर्ज शुल्क भरा',
        'अर्जाची स्थिती तपासत रहा'
      ],
      instructionsEn: [
        'Fill and submit application form',
        'Attach required documents',
        'Pay application fee',
        'Keep checking application status'
      ],
      documents: [
        {
          name: 'अर्ज फॉर्म',
          nameEn: 'Application Form',
          url: '/documents/youth-club-form.pdf',
          required: true
        },
        {
          name: 'वय प्रमाणपत्र',
          nameEn: 'Age Certificate',
          url: '/documents/age-certificate.pdf',
          required: true
        },
        {
          name: 'फोटो',
          nameEn: 'Photograph',
          url: '/documents/photo-requirements.pdf',
          required: true
        }
      ],
      contactInfo: {
        name: 'युवक मंडळ सचिव',
        nameEn: 'Youth Club Secretary',
        phone: '+91-XXXX-XXXXXX',
        email: 'youth@grampanchayat.gov.in'
      },
      priority: 'low',
      status: 'upcoming',
      lastUpdated: '2024-12-01'
    }
  ];

  const displayDeadlines = deadlines.length > 0 ? deadlines : demoDeadlines;

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'tax':
        return {
          label: 'कर भरणा',
          labelEn: 'Tax Payment',
          color: 'bg-red-500',
          icon: DollarSign
        };
      case 'election':
        return {
          label: 'निवडणुका',
          labelEn: 'Elections',
          color: 'bg-blue-500',
          icon: Vote
        };
      case 'camp':
        return {
          label: 'शिबिर',
          labelEn: 'Camp',
          color: 'bg-green-500',
          icon: Users
        };
      case 'application':
        return {
          label: 'अर्ज',
          labelEn: 'Application',
          color: 'bg-purple-500',
          icon: FileText
        };
      case 'meeting':
        return {
          label: 'बैठक',
          labelEn: 'Meeting',
          color: 'bg-orange-500',
          icon: Users
        };
      default:
        return {
          label: 'इतर',
          labelEn: 'Other',
          color: 'bg-gray-500',
          icon: AlertTriangle
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'urgent':
        return {
          label: 'तातडीचे',
          labelEn: 'Urgent',
          color: 'text-red-600 bg-red-100',
          icon: AlertTriangle
        };
      case 'due-soon':
        return {
          label: 'लवकरच येणार',
          labelEn: 'Due Soon',
          color: 'text-orange-600 bg-orange-100',
          icon: Clock
        };
      case 'upcoming':
        return {
          label: 'येत आहे',
          labelEn: 'Upcoming',
          color: 'text-blue-600 bg-blue-100',
          icon: Calendar
        };
      case 'overdue':
        return {
          label: 'ओव्हरड्यू',
          labelEn: 'Overdue',
          color: 'text-red-600 bg-red-100',
          icon: AlertCircle
        };
      case 'completed':
        return {
          label: 'पूर्ण',
          labelEn: 'Completed',
          color: 'text-green-600 bg-green-100',
          icon: CheckCircle
        };
      default:
        return {
          label: 'अज्ञात',
          labelEn: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: Info
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            महत्त्वाच्या अंतिम मुदती
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Important Deadlines
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          कर भरणा, निवडणुका, शिबिरे आणि इतर महत्त्वाच्या अंतिम मुदती
        </p>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayDeadlines.map((deadline) => {
          const typeInfo = getTypeInfo(deadline.type);
          const statusInfo = getStatusInfo(deadline.status);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;
          const daysLeft = getDaysUntilDeadline(deadline.deadline);

          return (
            <Card key={deadline.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {deadline.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{deadline.titleEn}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={`${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority === 'urgent' ? 'तातडीचे' : 
                       deadline.priority === 'high' ? 'उच्च' : 
                       deadline.priority === 'medium' ? 'मध्यम' : 'कमी'}
                    </Badge>
                    <Badge className={`${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">
                      {new Date(deadline.deadline).toLocaleDateString('mr-IN')}
                    </span>
                    <span className="text-gray-400">({deadline.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {daysLeft > 0 ? `${daysLeft} दिवस शिल्लक` : 
                       daysLeft === 0 ? 'आजची मुदत' : 
                       `${Math.abs(daysLeft)} दिवस ओव्हरड्यू`}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">वर्णन</h4>
                  <p className="text-sm text-gray-600">
                    {deadline.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deadline.descriptionEn}
                  </p>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">सूचना</h4>
                  <ul className="space-y-1">
                    {deadline.instructions.slice(0, 3).map((instruction, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                    {deadline.instructions.length > 3 && (
                      <li className="text-sm text-blue-600 font-medium">
                        +{deadline.instructions.length - 3} अधिक सूचना
                      </li>
                    )}
                  </ul>
                </div>

                {/* Documents */}
                {deadline.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      आवश्यक कागदपत्रे
                    </h4>
                    <div className="space-y-1">
                      {deadline.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className={doc.required ? 'font-medium text-gray-900' : 'text-gray-600'}>
                              {doc.name}
                            </span>
                            {doc.required && (
                              <Badge className="text-xs bg-red-100 text-red-700">आवश्यक</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">संपर्क माहिती</h4>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{deadline.contactInfo.name}</div>
                    <div className="text-xs text-gray-500">{deadline.contactInfo.nameEn}</div>
                    <div className="text-xs">{deadline.contactInfo.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                मुदतीची आठवण मिळवा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              महत्त्वाच्या मुदतीच्या आठवणीसाठी नोटिफिकेशन सबस्क्राइब करा
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                आठवण सबस्क्राइब करा
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Calendar className="h-4 w-4 mr-2" />
                कॅलेंडर पहा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
