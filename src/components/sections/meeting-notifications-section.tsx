'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Download,
  Bell,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface MeetingNotification {
  id: string;
  title: string;
  titleEn: string;
  type: 'gram-sabha' | 'village-committee' | 'special-meeting';
  date: string;
  time: string;
  venue: string;
  venueEn: string;
  agenda: string[] | any;
  agendaEn: string[] | any;
  status: 'upcoming' | 'ongoing' | 'completed';
  priority: 'high' | 'medium' | 'low';
  attendees: number;
  quorum: number;
  documents: {
    name: string;
    nameEn: string;
    url: string;
    type: 'agenda' | 'minutes' | 'notice' | 'resolution';
  }[] | any;
  lastUpdated: string;
}

interface MeetingNotificationsSectionProps {
  meetings?: MeetingNotification[];
}

export default function MeetingNotificationsSection({ meetings: propMeetings = [] }: MeetingNotificationsSectionProps) {
  const [meetings, setMeetings] = useState<MeetingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (propMeetings.length > 0) {
      setMeetings(propMeetings);
      setIsLoading(false);
    } else {
      fetchMeetings();
    }
  }, [propMeetings]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meeting-notifications');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Demo data for when no meetings are available
  const demoMeetings: MeetingNotification[] = [
    {
      id: 'meeting-1',
      title: 'ग्रामसभा बैठक',
      titleEn: 'Gram Sabha Meeting',
      type: 'gram-sabha',
      date: '2024-12-15',
      time: '11:00 AM',
      venue: 'ग्रामपंचायत कार्यालय',
      venueEn: 'Gram Panchayat Office',
      agenda: [
        'वार्षिक अहवालाची चर्चा',
        'बजेट अंदाजपत्रक',
        'विकास कामांची प्रगती',
        'नवीन योजनांची माहिती',
        'जनसहभागाचे प्रश्न'
      ],
      agendaEn: [
        'Discussion on Annual Report',
        'Budget Estimates',
        'Progress of Development Works',
        'Information about New Schemes',
        'Public Participation Questions'
      ],
      status: 'upcoming',
      priority: 'high',
      attendees: 0,
      quorum: 100,
      documents: [
        {
          name: 'अजेंडा',
          nameEn: 'Agenda',
          url: '/documents/gram-sabha-agenda.pdf',
          type: 'agenda'
        },
        {
          name: 'सूचना',
          nameEn: 'Notice',
          url: '/documents/gram-sabha-notice.pdf',
          type: 'notice'
        }
      ],
      lastUpdated: '2024-12-01'
    },
    {
      id: 'meeting-2',
      title: 'गाव समिती बैठक',
      titleEn: 'Village Committee Meeting',
      type: 'village-committee',
      date: '2024-12-10',
      time: '02:00 PM',
      venue: 'सामुदायिक भवन',
      venueEn: 'Community Hall',
      agenda: [
        'स्वच्छता अभियानाची योजना',
        'शिक्षण समितीचा अहवाल',
        'महिला सशक्तिकरण कार्यक्रम',
        'युवक मंडळाची कार्यक्रमे'
      ],
      agendaEn: [
        'Planning for Sanitation Campaign',
        'Education Committee Report',
        'Women Empowerment Programs',
        'Youth Club Activities'
      ],
      status: 'upcoming',
      priority: 'medium',
      attendees: 0,
      quorum: 25,
      documents: [
        {
          name: 'अजेंडा',
          nameEn: 'Agenda',
          url: '/documents/village-committee-agenda.pdf',
          type: 'agenda'
        }
      ],
      lastUpdated: '2024-12-01'
    },
    {
      id: 'meeting-3',
      title: 'विशेष बैठक - पाणी पुरवठा',
      titleEn: 'Special Meeting - Water Supply',
      type: 'special-meeting',
      date: '2024-12-05',
      time: '10:00 AM',
      venue: 'ग्रामपंचायत कार्यालय',
      venueEn: 'Gram Panchayat Office',
      agenda: [
        'पाणी पुरवठा समस्येची चर्चा',
        'नवीन पंपिंग स्टेशनची योजना',
        'पाणी दरांची चर्चा',
        'जनसहभागाचे सुझाव'
      ],
      agendaEn: [
        'Discussion on Water Supply Issues',
        'Planning for New Pumping Station',
        'Discussion on Water Rates',
        'Public Participation Suggestions'
      ],
      status: 'completed',
      priority: 'high',
      attendees: 85,
      quorum: 50,
      documents: [
        {
          name: 'बैठकीची नोंद',
          nameEn: 'Meeting Minutes',
          url: '/documents/water-supply-minutes.pdf',
          type: 'minutes'
        },
        {
          name: 'निर्णय',
          nameEn: 'Resolution',
          url: '/documents/water-supply-resolution.pdf',
          type: 'resolution'
        }
      ],
      lastUpdated: '2024-12-05'
    }
  ];

  // Normalize agenda and documents from JSON if needed
  const normalizeMeetings = (meetingsData: MeetingNotification[]) => {
    return meetingsData.map(meeting => ({
      ...meeting,
      agenda: Array.isArray(meeting.agenda) ? meeting.agenda : (typeof meeting.agenda === 'string' ? JSON.parse(meeting.agenda) : []),
      agendaEn: Array.isArray(meeting.agendaEn) ? meeting.agendaEn : (typeof meeting.agendaEn === 'string' ? JSON.parse(meeting.agendaEn) : []),
      documents: Array.isArray(meeting.documents) ? meeting.documents : (typeof meeting.documents === 'string' ? JSON.parse(meeting.documents) : [])
    }));
  };

  const normalizedMeetings = normalizeMeetings(meetings);
  const displayMeetings = normalizedMeetings.length > 0 ? normalizedMeetings : demoMeetings;

  const getMeetingTypeInfo = (type: string) => {
    switch (type) {
      case 'gram-sabha':
        return {
          label: 'ग्रामसभा',
          labelEn: 'Gram Sabha',
          color: 'bg-blue-500',
          icon: Users
        };
      case 'village-committee':
        return {
          label: 'गाव समिती',
          labelEn: 'Village Committee',
          color: 'bg-green-500',
          icon: Users
        };
      case 'special-meeting':
        return {
          label: 'विशेष बैठक',
          labelEn: 'Special Meeting',
          color: 'bg-orange-500',
          icon: AlertCircle
        };
      default:
        return {
          label: 'बैठक',
          labelEn: 'Meeting',
          color: 'bg-gray-500',
          icon: Users
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'येत आहे',
          labelEn: 'Upcoming',
          color: 'text-blue-600 bg-blue-100',
          icon: Clock
        };
      case 'ongoing':
        return {
          label: 'चालू',
          labelEn: 'Ongoing',
          color: 'text-yellow-600 bg-yellow-100',
          icon: Bell
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
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            बैठकीच्या सूचना
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Meeting Notifications
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          ग्रामसभा, गाव समिती आणि विशेष बैठकींच्या सूचना, अजेंडा आणि कार्यक्रम
        </p>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayMeetings.map((meeting) => {
          const typeInfo = getMeetingTypeInfo(meeting.type);
          const statusInfo = getStatusInfo(meeting.status);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={meeting.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              {/* Header */}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {meeting.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{meeting.titleEn}</p>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(meeting.priority)}`}>
                    {meeting.priority === 'high' ? 'उच्च' : meeting.priority === 'medium' ? 'मध्यम' : 'कमी'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(meeting.date).toLocaleDateString('mr-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{meeting.venue}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>{statusInfo.label}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {meeting.status === 'completed' ? `${meeting.attendees} उपस्थित` : `${meeting.quorum} क्वोरम`}
                  </div>
                </div>

                {/* Agenda */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    अजेंडा
                  </h4>
                  <ul className="space-y-1">
                    {(Array.isArray(meeting.agenda) ? meeting.agenda.slice(0, 3) : []).map((item: any, idx: number) => typeof item === 'string' ? (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ) : null)}
                    {meeting.agenda.length > 3 && (
                      <li className="text-sm text-blue-600 font-medium">
                        +{meeting.agenda.length - 3} अधिक मुद्दे
                      </li>
                    )}
                  </ul>
                </div>

                {/* Documents */}
                {meeting.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      दस्तावेज
                    </h4>
                    <div className="space-y-1">
                      {meeting.documents.map((doc: any, idx: number) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.nameEn}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  अद्यतन: {new Date(meeting.lastUpdated).toLocaleDateString('mr-IN')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                बैठक सूचना मिळवा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              नवीन बैठकींच्या सूचना आपल्या मोबाइलवर मिळवण्यासाठी नोंदणी करा
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Bell className="h-4 w-4 mr-2" />
                सूचना सबस्क्राइब करा
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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
