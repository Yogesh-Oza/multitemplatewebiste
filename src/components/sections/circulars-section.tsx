'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  Download, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
  Building,
  User,
  Clock
} from 'lucide-react';

interface Circular {
  id: string;
  title: string;
  titleEn: string;
  type: 'circular' | 'order' | 'memo' | 'notification';
  department: string;
  departmentEn: string;
  number: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'superseded' | 'draft';
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
  attachments: {
    name: string;
    nameEn: string;
    url: string;
    type: 'pdf' | 'doc' | 'image';
    size: string;
  }[] | any;
  issuedBy: string;
  issuedByEn: string;
  lastUpdated: string;
}

interface CircularsSectionProps {
  circulars?: Circular[];
}

export default function CircularsSection({ circulars: propCirculars = [] }: CircularsSectionProps) {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (propCirculars.length > 0) {
      setCirculars(propCirculars);
      setIsLoading(false);
    } else {
      fetchCirculars();
    }
  }, [propCirculars]);

  const fetchCirculars = async () => {
    try {
      const response = await fetch('/api/circulars');
      if (response.ok) {
        const data = await response.json();
        setCirculars(data);
      }
    } catch (error) {
      console.error('Error fetching circulars:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Demo data for when no circulars are available
  const demoCirculars: Circular[] = [
    {
      id: 'circular-1',
      title: 'स्वच्छता अभियानासाठी परिपत्रक',
      titleEn: 'Circular for Sanitation Campaign',
      type: 'circular',
      department: 'स्वच्छता विभाग',
      departmentEn: 'Sanitation Department',
      number: 'SWA/2024/001',
      date: '2024-12-01',
      priority: 'high',
      status: 'active',
      description: 'गावातील स्वच्छता अभियानासाठी सर्व नागरिकांना सहभागी होण्याचे आवाहन',
      descriptionEn: 'Appeal to all citizens to participate in village sanitation campaign',
      content: 'ग्रामपंचायत कार्यालयाकडून सर्व नागरिकांना सूचित केले जाते की, १५ डिसेंबर २०२४ रोजी गावातील स्वच्छता अभियान सुरू होणार आहे. सर्व नागरिकांनी या अभियानात सक्रिय सहभाग घ्यावा.',
      contentEn: 'All citizens are hereby informed that the village sanitation campaign will start on December 15, 2024. All citizens should actively participate in this campaign.',
      attachments: [
        {
          name: 'परिपत्रक',
          nameEn: 'Circular',
          url: '/documents/sanitation-circular.pdf',
          type: 'pdf',
          size: '2.5 MB'
        },
        {
          name: 'अभियान योजना',
          nameEn: 'Campaign Plan',
          url: '/documents/sanitation-plan.pdf',
          type: 'pdf',
          size: '1.8 MB'
        }
      ],
      issuedBy: 'सरपंच',
      issuedByEn: 'Sarpanch',
      lastUpdated: '2024-12-01'
    },
    {
      id: 'circular-2',
      title: 'पाणी दर वाढीचा आदेश',
      titleEn: 'Order for Water Rate Increase',
      type: 'order',
      department: 'पाणी पुरवठा विभाग',
      departmentEn: 'Water Supply Department',
      number: 'WS/2024/002',
      date: '2024-11-28',
      priority: 'medium',
      status: 'active',
      description: 'पाणी दरांमध्ये १०% वाढ करण्याचा आदेश',
      descriptionEn: 'Order for 10% increase in water rates',
      content: 'ग्रामपंचायत कार्यालयाच्या निर्णयानुसार, १ जानेवारी २०२५ पासून पाणी दरांमध्ये १०% वाढ केली जाईल. नवीन दरांची माहिती कार्यालयात उपलब्ध आहे.',
      contentEn: 'As per the decision of Gram Panchayat Office, water rates will be increased by 10% from January 1, 2025. Information about new rates is available at the office.',
      attachments: [
        {
          name: 'आदेश',
          nameEn: 'Order',
          url: '/documents/water-rate-order.pdf',
          type: 'pdf',
          size: '1.2 MB'
        },
        {
          name: 'नवीन दर सारणी',
          nameEn: 'New Rate Chart',
          url: '/documents/water-rate-chart.pdf',
          type: 'pdf',
          size: '0.8 MB'
        }
      ],
      issuedBy: 'ग्रामसेवक',
      issuedByEn: 'Gramsevak',
      lastUpdated: '2024-11-28'
    },
    {
      id: 'circular-3',
      title: 'शिक्षण समितीची कार्यालयीन नोंद',
      titleEn: 'Office Note from Education Committee',
      type: 'memo',
      department: 'शिक्षण विभाग',
      departmentEn: 'Education Department',
      number: 'ED/2024/003',
      date: '2024-11-25',
      priority: 'low',
      status: 'active',
      description: 'शाळेतील मुलांच्या शैक्षणिक प्रगतीबाबत',
      descriptionEn: 'Regarding educational progress of school children',
      content: 'शाळेतील मुलांच्या शैक्षणिक प्रगतीबाबत चर्चा करण्यासाठी शिक्षण समितीची बैठक १० डिसेंबर २०२४ रोजी घेण्यात येणार आहे.',
      contentEn: 'Education Committee meeting will be held on December 10, 2024 to discuss the educational progress of school children.',
      attachments: [
        {
          name: 'कार्यालयीन नोंद',
          nameEn: 'Office Note',
          url: '/documents/education-memo.pdf',
          type: 'pdf',
          size: '0.5 MB'
        }
      ],
      issuedBy: 'शिक्षण समिती अध्यक्ष',
      issuedByEn: 'Education Committee Chairman',
      lastUpdated: '2024-11-25'
    },
    {
      id: 'circular-4',
      title: 'निवडणुकीची सूचना',
      titleEn: 'Election Notification',
      type: 'notification',
      department: 'निवडणूक विभाग',
      departmentEn: 'Election Department',
      number: 'EL/2024/004',
      date: '2024-11-20',
      priority: 'high',
      status: 'active',
      description: 'ग्रामपंचायत निवडणुकीची सूचना',
      descriptionEn: 'Gram Panchayat Election Notification',
      content: 'ग्रामपंचायत निवडणुका १५ जानेवारी २०२५ रोजी घेण्यात येणार आहेत. नामनिर्देशन १ डिसेंबर २०२४ पासून सुरू होईल.',
      contentEn: 'Gram Panchayat elections will be held on January 15, 2025. Nominations will start from December 1, 2024.',
      attachments: [
        {
          name: 'निवडणूक सूचना',
          nameEn: 'Election Notification',
          url: '/documents/election-notification.pdf',
          type: 'pdf',
          size: '3.2 MB'
        },
        {
          name: 'नामनिर्देशन फॉर्म',
          nameEn: 'Nomination Form',
          url: '/documents/nomination-form.pdf',
          type: 'pdf',
          size: '0.9 MB'
        }
      ],
      issuedBy: 'निवडणूक अधिकारी',
      issuedByEn: 'Election Officer',
      lastUpdated: '2024-11-20'
    }
  ];

  // Normalize attachments from JSON if needed
  const normalizeCirculars = (circularsData: Circular[]) => {
    return circularsData.map(circular => ({
      ...circular,
      attachments: Array.isArray(circular.attachments) ? circular.attachments : (typeof circular.attachments === 'string' ? JSON.parse(circular.attachments) : [])
    }));
  };

  const normalizedCirculars = normalizeCirculars(circulars);
  const displayCirculars = normalizedCirculars.length > 0 ? normalizedCirculars : demoCirculars;

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'circular':
        return {
          label: 'परिपत्रक',
          labelEn: 'Circular',
          color: 'bg-blue-500',
          icon: FileText
        };
      case 'order':
        return {
          label: 'आदेश',
          labelEn: 'Order',
          color: 'bg-red-500',
          icon: AlertCircle
        };
      case 'memo':
        return {
          label: 'कार्यालयीन नोंद',
          labelEn: 'Office Memo',
          color: 'bg-green-500',
          icon: Info
        };
      case 'notification':
        return {
          label: 'सूचना',
          labelEn: 'Notification',
          color: 'bg-orange-500',
          icon: CheckCircle
        };
      default:
        return {
          label: 'दस्तावेज',
          labelEn: 'Document',
          color: 'bg-gray-500',
          icon: FileText
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'सक्रिय',
          labelEn: 'Active',
          color: 'text-green-600 bg-green-100',
          icon: CheckCircle
        };
      case 'superseded':
        return {
          label: 'रद्द',
          labelEn: 'Superseded',
          color: 'text-red-600 bg-red-100',
          icon: AlertCircle
        };
      case 'draft':
        return {
          label: 'मसुदा',
          labelEn: 'Draft',
          color: 'text-yellow-600 bg-yellow-100',
          icon: Info
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
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-green-100">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            परिपत्रके / आदेश / कार्यालयीन नोंदी
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Circulars / Orders / Official Notes
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          सरकारी परिपत्रके, आदेश, कार्यालयीन नोंदी आणि सूचना
        </p>
      </div>

      {/* Circulars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayCirculars.map((circular) => {
          const typeInfo = getTypeInfo(circular.type);
          const statusInfo = getStatusInfo(circular.status);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={circular.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                        {circular.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{circular.titleEn}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={`${getPriorityColor(circular.priority)}`}>
                      {circular.priority === 'high' ? 'उच्च' : circular.priority === 'medium' ? 'मध्यम' : 'कमी'}
                    </Badge>
                    <Badge className={`${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{circular.department}</span>
                    <span className="text-gray-400">({circular.departmentEn})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>क्र. {circular.number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(circular.date).toLocaleDateString('mr-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{circular.issuedBy}</span>
                    <span className="text-gray-400">({circular.issuedByEn})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">वर्णन</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {circular.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {circular.descriptionEn}
                  </p>
                </div>

                {/* Content Preview */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">सामग्री</h4>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {circular.content}
                  </p>
                </div>

                {/* Attachments */}
                {circular.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      संलग्नक
                    </h4>
                    <div className="space-y-1">
                      {circular.attachments.map((attachment: any, idx: number) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => window.open(attachment.url, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <div className="flex-1">
                            <div className="font-medium">{attachment.name}</div>
                            <div className="text-xs text-gray-500">
                              {attachment.nameEn} • {attachment.size}
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>अद्यतन: {new Date(circular.lastUpdated).toLocaleDateString('mr-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                सर्व दस्तावेज डाउनलोड करा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              सर्व परिपत्रके, आदेश आणि कार्यालयीन नोंदी एकाच ठिकाणी उपलब्ध
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                सर्व डाउनलोड करा
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <FileText className="h-4 w-4 mr-2" />
                अर्काइव्ह पहा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
