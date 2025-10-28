'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  Download,
  Share
} from 'lucide-react';
import { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  venueEn: string;
  type: 'gram-sabha' | 'village-committee' | 'camp' | 'festival' | 'meeting' | 'other';
  description: string;
  descriptionEn: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  organizer: string;
  organizerEn: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  documents: {
    name: string;
    nameEn: string;
    url: string;
  }[];
  reminders: boolean;
}

interface InteractiveCalendarSectionProps {
  events?: CalendarEvent[];
}

export default function InteractiveCalendarSection({ events = [] }: InteractiveCalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Demo data for when no events are available
  const demoEvents: CalendarEvent[] = [
    {
      id: 'event-1',
      title: 'ग्रामसभा बैठक',
      titleEn: 'Gram Sabha Meeting',
      date: '2024-12-15',
      time: '11:00 AM',
      duration: '2 hours',
      venue: 'ग्रामपंचायत कार्यालय',
      venueEn: 'Gram Panchayat Office',
      type: 'gram-sabha',
      description: 'मासिक ग्रामसभा बैठक - विकास कामांची चर्चा',
      descriptionEn: 'Monthly Gram Sabha meeting - Discussion on development works',
      attendees: 0,
      maxAttendees: 200,
      status: 'upcoming',
      priority: 'high',
      organizer: 'सरपंच',
      organizerEn: 'Sarpanch',
      contactInfo: {
        phone: '+91-XXXX-XXXXXX',
        email: 'sarpanch@grampanchayat.gov.in'
      },
      documents: [
        { name: 'अजेंडा', nameEn: 'Agenda', url: '/documents/gram-sabha-agenda.pdf' },
        { name: 'सूचना', nameEn: 'Notice', url: '/documents/gram-sabha-notice.pdf' }
      ],
      reminders: true
    },
    {
      id: 'event-2',
      title: 'स्वच्छता मोहीम',
      titleEn: 'Sanitation Campaign',
      date: '2024-12-12',
      time: '07:00 AM',
      duration: '4 hours',
      venue: 'गाव सर्वत्र',
      venueEn: 'Throughout Village',
      type: 'camp',
      description: 'गावातील स्वच्छता अभियान - सर्व नागरिकांना सहभागी होण्याचे आवाहन',
      descriptionEn: 'Village sanitation campaign - Appeal to all citizens to participate',
      attendees: 0,
      maxAttendees: 500,
      status: 'upcoming',
      priority: 'high',
      organizer: 'स्वच्छता समिती',
      organizerEn: 'Sanitation Committee',
      contactInfo: {
        phone: '+91-XXXX-XXXXXX',
        email: 'sanitation@grampanchayat.gov.in'
      },
      documents: [
        { name: 'अभियान योजना', nameEn: 'Campaign Plan', url: '/documents/sanitation-plan.pdf' }
      ],
      reminders: true
    },
    {
      id: 'event-3',
      title: 'वृक्षारोपण कार्यक्रम',
      titleEn: 'Tree Plantation Program',
      date: '2024-12-20',
      time: '09:00 AM',
      duration: '3 hours',
      venue: 'शाळेजवळ',
      venueEn: 'Near School',
      type: 'camp',
      description: 'पर्यावरण दिनाच्या निमित्ताने वृक्षारोपण कार्यक्रम',
      descriptionEn: 'Tree plantation program on the occasion of Environment Day',
      attendees: 0,
      maxAttendees: 100,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'पर्यावरण समिती',
      organizerEn: 'Environment Committee',
      contactInfo: {
        phone: '+91-XXXX-XXXXXX',
        email: 'environment@grampanchayat.gov.in'
      },
      documents: [
        { name: 'कार्यक्रम योजना', nameEn: 'Program Plan', url: '/documents/tree-plantation-plan.pdf' }
      ],
      reminders: true
    },
    {
      id: 'event-4',
      title: 'गाव समिती बैठक',
      titleEn: 'Village Committee Meeting',
      date: '2024-12-10',
      time: '02:00 PM',
      duration: '1.5 hours',
      venue: 'सामुदायिक भवन',
      venueEn: 'Community Hall',
      type: 'village-committee',
      description: 'गाव समितीची मासिक बैठक - सामाजिक कार्यक्रमांची योजना',
      descriptionEn: 'Monthly Village Committee meeting - Planning social programs',
      attendees: 0,
      maxAttendees: 50,
      status: 'upcoming',
      priority: 'medium',
      organizer: 'गाव समिती अध्यक्ष',
      organizerEn: 'Village Committee Chairman',
      contactInfo: {
        phone: '+91-XXXX-XXXXXX',
        email: 'village-committee@grampanchayat.gov.in'
      },
      documents: [
        { name: 'अजेंडा', nameEn: 'Agenda', url: '/documents/village-committee-agenda.pdf' }
      ],
      reminders: true
    },
    {
      id: 'event-5',
      title: 'दिवाळी उत्सव',
      titleEn: 'Diwali Festival',
      date: '2024-12-25',
      time: '06:00 PM',
      duration: '4 hours',
      venue: 'ग्रामपंचायत चौक',
      venueEn: 'Gram Panchayat Square',
      type: 'festival',
      description: 'दिवाळी उत्सव - सामुदायिक साजरा',
      descriptionEn: 'Diwali Festival - Community celebration',
      attendees: 0,
      maxAttendees: 300,
      status: 'upcoming',
      priority: 'low',
      organizer: 'उत्सव समिती',
      organizerEn: 'Festival Committee',
      contactInfo: {
        phone: '+91-XXXX-XXXXXX',
        email: 'festival@grampanchayat.gov.in'
      },
      documents: [
        { name: 'उत्सव योजना', nameEn: 'Festival Plan', url: '/documents/diwali-plan.pdf' }
      ],
      reminders: true
    }
  ];

  const displayEvents = events.length > 0 ? events : demoEvents;

  const getEventTypeInfo = (type: string) => {
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
      case 'camp':
        return {
          label: 'शिबिर',
          labelEn: 'Camp',
          color: 'bg-orange-500',
          icon: Users
        };
      case 'festival':
        return {
          label: 'उत्सव',
          labelEn: 'Festival',
          color: 'bg-purple-500',
          icon: Users
        };
      case 'meeting':
        return {
          label: 'बैठक',
          labelEn: 'Meeting',
          color: 'bg-yellow-500',
          icon: Users
        };
      default:
        return {
          label: 'इतर',
          labelEn: 'Other',
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
          icon: Calendar
        };
      case 'cancelled':
        return {
          label: 'रद्द',
          labelEn: 'Cancelled',
          color: 'text-red-600 bg-red-100',
          icon: Calendar
        };
      default:
        return {
          label: 'अज्ञात',
          labelEn: 'Unknown',
          color: 'text-gray-600 bg-gray-100',
          icon: Calendar
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

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return displayEvents.filter(event => event.date === dateStr);
  };

  const getEventsForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return displayEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = getEventsForDate(currentDay);
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = currentDay.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && currentDay.toDateString() === selectedDate.toDateString();
      
      days.push(
        <div
          key={i}
          className={`p-2 min-h-[100px] border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
          } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${
            isSelected ? 'bg-blue-100 border-blue-400' : ''
          }`}
          onClick={() => setSelectedDate(currentDay)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
              {currentDay.getDate()}
            </span>
            {dayEvents.length > 0 && (
              <Badge className="text-xs bg-blue-100 text-blue-700">
                {dayEvents.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => {
              const typeInfo = getEventTypeInfo(event.type);
              return (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded ${typeInfo.color} text-white truncate`}
                  title={event.title}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} अधिक
              </div>
            )}
          </div>
        </div>
      );
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const monthNames = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ];

  const dayNames = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-indigo-100">
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            इंटरअॅक्टिव्ह कॅलेंडर
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Interactive Calendar
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          आगामी गाव घटना आणि ग्रामसभा बैठकांचे वेळापत्रक
        </p>
      </div>

      {/* Calendar Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                महिना
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                आठवडा
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                दिवस
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                घटना जोडा
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                डाउनलोड
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                शेअर
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {viewMode === 'month' && (
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-700 bg-gray-100 rounded">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </div>
          )}

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('mr-IN')} - घटना
              </h3>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => {
                    const typeInfo = getEventTypeInfo(event.type);
                    const statusInfo = getStatusInfo(event.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Card key={event.id} className="border-0 shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.titleEn}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={`${getPriorityColor(event.priority)}`}>
                                {event.priority === 'high' ? 'उच्च' : event.priority === 'medium' ? 'मध्यम' : 'कमी'}
                              </Badge>
                              <Badge className={`${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.time} ({event.duration})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees}/{event.maxAttendees} उपस्थित</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  या दिवशी कोणतीही घटना नाही
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-green-600" />
            आगामी घटना
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayEvents.slice(0, 6).map((event) => {
              const typeInfo = getEventTypeInfo(event.type);
              const statusInfo = getStatusInfo(event.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={event.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${typeInfo.color}`}></div>
                      <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                    </div>
                    <Badge className={`${statusInfo.color} text-xs`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
