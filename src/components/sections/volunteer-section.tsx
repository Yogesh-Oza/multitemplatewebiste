'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  CheckCircle,
  ExternalLink,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  UserPlus,
  Trophy,
  Target,
  Heart as HandHeart
} from 'lucide-react';
import Image from 'next/image';

interface VolunteerData {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  skills: string[];
  skillsEn: string[];
  interests: string[];
  interestsEn: string[];
  availability: string;
  availabilityEn: string;
  experience: string;
  experienceEn: string;
  photo?: string;
  isActive: boolean;
  joinDate: string;
  hoursContributed: number;
  projectsCompleted: number;
  rating: number;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'education' | 'health' | 'environment' | 'social' | 'cultural' | 'sports';
  location: string;
  locationEn: string;
  date: string;
  time: string;
  timeEn: string;
  duration: string;
  durationEn: string;
  requiredSkills: string[];
  requiredSkillsEn: string[];
  maxVolunteers: number;
  currentVolunteers: number;
  organizer: string;
  organizerEn: string;
  contact: string;
  image?: string;
  isActive: boolean;
  isUrgent: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'festival' | 'meeting' | 'workshop' | 'sports' | 'cultural' | 'social';
  date: string;
  time: string;
  timeEn: string;
  location: string;
  locationEn: string;
  organizer: string;
  organizerEn: string;
  expectedAttendance: number;
  image?: string;
  isActive: boolean;
  isPublic: boolean;
}

interface VolunteerSectionProps {
  volunteers?: VolunteerData[];
  opportunities?: VolunteerOpportunity[];
  events?: CommunityEvent[];
  statistics?: {
    totalVolunteers: number;
    activeVolunteers: number;
    totalHours: number;
    totalProjects: number;
    upcomingEvents: number;
    completedProjects: number;
  };
}

export function VolunteerSection({ 
  volunteers = [], 
  opportunities = [],
  events = [],
  statistics = {
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalHours: 0,
    totalProjects: 0,
    upcomingEvents: 0,
    completedProjects: 0
  }
}: VolunteerSectionProps) {
  const { t, language } = useTranslation();

  // Group opportunities by category
  const groupedOpportunities = opportunities.reduce((acc, opportunity) => {
    if (!acc[opportunity.category]) {
      acc[opportunity.category] = [];
    }
    acc[opportunity.category].push(opportunity);
    return acc;
  }, {} as Record<string, VolunteerOpportunity[]>);

  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, CommunityEvent[]>);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'education':
        return {
          label: language === 'en' ? 'Education' : 'शिक्षण',
          icon: Users,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'health':
        return {
          label: language === 'en' ? 'Health' : 'आरोग्य',
          icon: Heart,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'environment':
        return {
          label: language === 'en' ? 'Environment' : 'पर्यावरण',
          icon: Target,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'social':
        return {
          label: language === 'en' ? 'Social' : 'सामाजिक',
          icon: HandHeart,
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'cultural':
        return {
          label: language === 'en' ? 'Cultural' : 'सांस्कृतिक',
          icon: Trophy,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'sports':
        return {
          label: language === 'en' ? 'Sports' : 'क्रीडा',
          icon: Award,
          color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
          badgeColor: 'bg-cyan-100 text-cyan-800'
        };
      default:
        return {
          label: category,
          icon: Users,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getEventTypeInfo = (type: string) => {
    switch (type) {
      case 'festival':
        return {
          label: language === 'en' ? 'Festivals' : 'उत्सव',
          icon: Trophy,
          color: 'text-orange-600 bg-orange-50'
        };
      case 'meeting':
        return {
          label: language === 'en' ? 'Meetings' : 'बैठका',
          icon: Users,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'workshop':
        return {
          label: language === 'en' ? 'Workshops' : 'कार्यशाळा',
          icon: Target,
          color: 'text-green-600 bg-green-50'
        };
      case 'sports':
        return {
          label: language === 'en' ? 'Sports' : 'क्रीडा',
          icon: Award,
          color: 'text-cyan-600 bg-cyan-50'
        };
      case 'cultural':
        return {
          label: language === 'en' ? 'Cultural' : 'सांस्कृतिक',
          icon: Trophy,
          color: 'text-purple-600 bg-purple-50'
        };
      case 'social':
        return {
          label: language === 'en' ? 'Social' : 'सामाजिक',
          icon: HandHeart,
          color: 'text-red-600 bg-red-50'
        };
      default:
        return {
          label: type,
          icon: Calendar,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  const getSkillLevel = (hours: number) => {
    if (hours >= 100) return { label: language === 'en' ? 'Expert' : 'तज्ञ', color: 'bg-purple-100 text-purple-800' };
    if (hours >= 50) return { label: language === 'en' ? 'Advanced' : 'प्रगत', color: 'bg-blue-100 text-blue-800' };
    if (hours >= 20) return { label: language === 'en' ? 'Intermediate' : 'मध्यम', color: 'bg-green-100 text-green-800' };
    return { label: language === 'en' ? 'Beginner' : 'सुरुवातीचा', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <section id="volunteer" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.volunteer.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join our community of volunteers and make a positive impact'
              : 'आमच्या स्वयंसेवक समुदायात सामील व्हा आणि सकारात्मक प्रभाव टाका'
            }
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalVolunteers}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Volunteers' : 'एकूण स्वयंसेवक'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.activeVolunteers}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Active Volunteers' : 'सक्रिय स्वयंसेवक'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalHours}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Hours Contributed' : 'दिलेले तास'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalProjects}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Projects' : 'एकूण प्रकल्प'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-cyan-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.upcomingEvents}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Upcoming Events' : 'आगामी कार्यक्रम'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.completedProjects}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Completed Projects' : 'पूर्ण प्रकल्प'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Opportunities */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Volunteer Opportunities' : 'स्वयंसेवक संधी'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Opportunities' : 'सर्व संधी पहा'}
            </Button>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <HandHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Volunteer opportunities will be updated soon'
                  : 'स्वयंसेवक संधी लवकरच अद्यतनित केल्या जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedOpportunities).map(([category, categoryOpportunities]) => {
                const categoryInfo = getCategoryInfo(category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color.split(' ')[1]}`}>
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {categoryInfo.label}
                      </h4>
                      <Badge className={categoryInfo.badgeColor}>
                        {categoryOpportunities.length} {language === 'en' ? 'Opportunities' : 'संधी'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryOpportunities.slice(0, 6).map((opportunity) => (
                        <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-300 group">
                          {opportunity.image && (
                            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                              <Image
                                src={opportunity.image}
                                alt={language === 'en' ? opportunity.titleEn : opportunity.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {opportunity.isUrgent && (
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-red-600 text-white">
                                    {language === 'en' ? 'Urgent' : 'तातडीचे'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                              {language === 'en' ? opportunity.titleEn : opportunity.title}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {language === 'en' ? opportunity.locationEn : opportunity.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(opportunity.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {language === 'en' ? opportunity.timeEn : opportunity.time}
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {language === 'en' ? opportunity.descriptionEn : opportunity.description}
                            </p>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Duration' : 'कालावधी'}:
                                </span>
                                <span className="font-medium">
                                  {language === 'en' ? opportunity.durationEn : opportunity.duration}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Volunteers' : 'स्वयंसेवक'}:
                                </span>
                                <span className="font-medium">
                                  {opportunity.currentVolunteers}/{opportunity.maxVolunteers}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Organizer' : 'आयोजक'}:
                                </span>
                                <span className="font-medium">
                                  {language === 'en' ? opportunity.organizerEn : opportunity.organizer}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Join Now' : 'आता सामील व्हा'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-gray-50"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Learn More' : 'अधिक जाणून घ्या'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {categoryOpportunities.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${categoryOpportunities.length - 6} More Opportunities` 
                            : `${categoryOpportunities.length - 6} अधिक संधी पहा`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Community Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Community Events' : 'समुदाय कार्यक्रम'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Events' : 'सर्व कार्यक्रम पहा'}
            </Button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Community events will be updated soon'
                  : 'समुदाय कार्यक्रम लवकरच अद्यतनित केले जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedEvents).map(([type, typeEvents]) => {
                const typeInfo = getEventTypeInfo(type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={type} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color.split(' ')[1]}`}>
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {typeInfo.label}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {typeEvents.length} {language === 'en' ? 'Events' : 'कार्यक्रम'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeEvents.slice(0, 6).map((event) => (
                        <Card key={event.id} className="hover:shadow-lg transition-all duration-300 group">
                          {event.image && (
                            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                              <Image
                                src={event.image}
                                alt={language === 'en' ? event.titleEn : event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                              {language === 'en' ? event.titleEn : event.title}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {language === 'en' ? event.locationEn : event.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {language === 'en' ? event.timeEn : event.time}
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {language === 'en' ? event.descriptionEn : event.description}
                            </p>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Organizer' : 'आयोजक'}:
                                </span>
                                <span className="font-medium">
                                  {language === 'en' ? event.organizerEn : event.organizer}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Expected Attendance' : 'अपेक्षित उपस्थिती'}:
                                </span>
                                <span className="font-medium">
                                  {event.expectedAttendance}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Register' : 'नोंदणी करा'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-gray-50"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Learn More' : 'अधिक जाणून घ्या'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {typeEvents.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${typeEvents.length - 6} More Events` 
                            : `${typeEvents.length - 6} अधिक कार्यक्रम पहा`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Volunteers */}
        {volunteers.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Top Volunteers' : 'शीर्ष स्वयंसेवक'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.slice(0, 6).map((volunteer, index) => {
                const skillLevel = getSkillLevel(volunteer.hoursContributed);
                
                return (
                  <Card key={volunteer.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      {volunteer.photo ? (
                        <div className="relative w-20 h-20 mx-auto mb-4">
                          <Image
                            src={volunteer.photo}
                            alt={language === 'en' ? volunteer.nameEn : volunteer.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {language === 'en' ? volunteer.nameEn : volunteer.name}
                      </h4>
                      
                      <div className="flex items-center justify-center mb-3">
                        <Badge className={skillLevel.color}>
                          {skillLevel.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-between">
                          <span>{language === 'en' ? 'Hours' : 'तास'}:</span>
                          <span className="font-medium">{volunteer.hoursContributed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{language === 'en' ? 'Projects' : 'प्रकल्प'}:</span>
                          <span className="font-medium">{volunteer.projectsCompleted}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(volunteer.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-gray-50"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Contact' : 'संपर्क करा'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Join Volunteer Program */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Join Our Volunteer Program' : 'आमच्या स्वयंसेवक कार्यक्रमात सामील व्हा'}
                </h3>
                <p className="text-blue-100">
                  {language === 'en' 
                    ? 'Make a difference in your community by volunteering your time and skills'
                    : 'तुमच्या वेळ आणि कौशल्याचा स्वयंसेवक म्हणून वापर करून तुमच्या समुदायात फरक करा'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Easy Registration' : 'सोपी नोंदणी'}
                  </h4>
                  <p className="text-sm text-blue-100">
                    {language === 'en' 
                      ? 'Quick and simple signup process'
                      : 'त्वरित आणि सोपी नोंदणी प्रक्रिया'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Flexible Schedule' : 'लवचिक वेळापत्रक'}
                  </h4>
                  <p className="text-sm text-blue-100">
                    {language === 'en' 
                      ? 'Choose opportunities that fit your schedule'
                      : 'तुमच्या वेळापत्रकाशी जुळणाऱ्या संधी निवडा'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Recognition' : 'ओळख'}
                  </h4>
                  <p className="text-sm text-blue-100">
                    {language === 'en' 
                      ? 'Get recognized for your contributions'
                      : 'तुमच्या योगदानासाठी ओळख मिळवा'
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Join Now' : 'आता सामील व्हा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <HandHeart className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Explore All Opportunities' : 'सर्व संधी एक्सप्लोर करा'}
          </Button>
        </div>
      </div>
    </section>
  );
}