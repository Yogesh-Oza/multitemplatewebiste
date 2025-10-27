'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  FileText,
  Calendar,
  Users,
  Building,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  User,
  Mail as EmailIcon,
  MessageSquare as MessageIcon,
  Star as StarIcon,
  Heart,
  Award,
  Shield,
  Target,
  Zap,
  Lightbulb,
  XCircle
} from 'lucide-react';
import Image from 'next/image';

interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'address' | 'social' | 'office';
  label: string;
  labelEn: string;
  value: string;
  description?: string;
  descriptionEn?: string;
  isPrimary: boolean;
  isActive: boolean;
}

interface OfficeHours {
  id: string;
  day: string;
  dayEn: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  subject: string;
  subjectEn: string;
  message: string;
  messageEn: string;
  rating: number;
  category: 'general' | 'complaint' | 'suggestion' | 'compliment' | 'technical';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  response?: string;
  responseEn?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

interface ContactSectionProps {
  contactInfo?: ContactInfo[];
  officeHours?: OfficeHours[];
  feedback?: FeedbackData[];
  statistics?: {
    totalFeedback: number;
    pendingFeedback: number;
    resolvedFeedback: number;
    averageRating: number;
    responseTime: number;
    satisfactionRate: number;
  };
}

export function ContactSection({ 
  contactInfo = [], 
  officeHours = [],
  feedback = [],
  statistics = {
    totalFeedback: 0,
    pendingFeedback: 0,
    resolvedFeedback: 0,
    averageRating: 0,
    responseTime: 0,
    satisfactionRate: 0
  }
}: ContactSectionProps) {
  const { t, language } = useTranslation();

  // Group contact info by type
  const groupedContactInfo = contactInfo.reduce((acc, info) => {
    if (!acc[info.type]) {
      acc[info.type] = [];
    }
    acc[info.type].push(info);
    return acc;
  }, {} as Record<string, ContactInfo[]>);

  // Group feedback by category
  const groupedFeedback = feedback.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FeedbackData[]>);

  const getContactTypeInfo = (type: string) => {
    switch (type) {
      case 'phone':
        return {
          label: language === 'en' ? 'Phone' : 'फोन',
          icon: Phone,
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'email':
        return {
          label: language === 'en' ? 'Email' : 'ईमेल',
          icon: Mail,
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      case 'address':
        return {
          label: language === 'en' ? 'Address' : 'पत्ता',
          icon: MapPin,
          color: 'text-red-600 bg-red-50 border-red-200'
        };
      case 'social':
        return {
          label: language === 'en' ? 'Social Media' : 'सामाजिक माध्यम',
          icon: Globe,
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        };
      case 'office':
        return {
          label: language === 'en' ? 'Office' : 'कार्यालय',
          icon: Building,
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      default:
        return {
          label: type,
          icon: MessageSquare,
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  const getFeedbackCategoryInfo = (category: string) => {
    switch (category) {
      case 'general':
        return {
          label: language === 'en' ? 'General' : 'सामान्य',
          icon: MessageSquare,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'complaint':
        return {
          label: language === 'en' ? 'Complaint' : 'तक्रार',
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50'
        };
      case 'suggestion':
        return {
          label: language === 'en' ? 'Suggestion' : 'सूचना',
          icon: Lightbulb,
          color: 'text-green-600 bg-green-50'
        };
      case 'compliment':
        return {
          label: language === 'en' ? 'Compliment' : 'प्रशंसा',
          icon: Heart,
          color: 'text-pink-600 bg-pink-50'
        };
      case 'technical':
        return {
          label: language === 'en' ? 'Technical' : 'तांत्रिक',
          icon: Zap,
          color: 'text-purple-600 bg-purple-50'
        };
      default:
        return {
          label: category,
          icon: MessageSquare,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: language === 'en' ? 'Pending' : 'प्रलंबित',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'in-progress':
        return {
          label: language === 'en' ? 'In Progress' : 'प्रगतीत',
          color: 'bg-blue-100 text-blue-800',
          icon: Target
        };
      case 'resolved':
        return {
          label: language === 'en' ? 'Resolved' : 'निवारण',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'closed':
        return {
          label: language === 'en' ? 'Closed' : 'बंद',
          color: 'bg-gray-100 text-gray-800',
          icon: XCircle
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return Facebook;
      case 'twitter':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'linkedin':
        return Linkedin;
      default:
        return Globe;
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.contact.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Get in touch with us and share your feedback'
              : 'आमच्याशी संपर्क साधा आणि तुमचा अभिप्राय सामायिक करा'
            }
          </p>
        </div>

        {/* Contact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalFeedback}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Feedback' : 'एकूण अभिप्राय'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.pendingFeedback}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Pending' : 'प्रलंबित'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.resolvedFeedback}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Resolved' : 'निवारण'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.averageRating}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Average Rating' : 'सरासरी रेटिंग'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.responseTime}h
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Response Time' : 'प्रतिसाद वेळ'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.satisfactionRate}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Satisfaction' : 'समाधान'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Contact Information' : 'संपर्क माहिती'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Contacts' : 'सर्व संपर्क पहा'}
            </Button>
          </div>

          {contactInfo.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Contact information will be updated soon'
                  : 'संपर्क माहिती लवकरच अद्यतनित केली जाईल'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedContactInfo).map(([type, typeContacts]) => {
                const typeInfo = getContactTypeInfo(type);
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
                        {typeContacts.length} {language === 'en' ? 'Contacts' : 'संपर्क'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeContacts.map((contact) => (
                        <Card key={contact.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                {language === 'en' ? contact.labelEn : contact.label}
                              </CardTitle>
                              {contact.isPrimary && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {language === 'en' ? 'Primary' : 'प्राथमिक'}
                                </Badge>
                              )}
                            </div>
                            {contact.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {language === 'en' ? contact.descriptionEn : contact.description}
                              </p>
                            )}
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-sm">
                                <TypeIcon className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-gray-900 font-medium">
                                  {contact.value}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {type === 'phone' && (
                                <Button 
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                  size="sm"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Call' : 'कॉल करा'}
                                </Button>
                              )}
                              {type === 'email' && (
                                <Button 
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Email' : 'ईमेल करा'}
                                </Button>
                              )}
                              {type === 'social' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Visit' : 'भेट द्या'}
                                </Button>
                              )}
                              {type === 'address' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Directions' : 'दिशा'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Office Hours */}
        {officeHours.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {language === 'en' ? 'Office Hours' : 'कार्यालयीन वेळ'}
            </h3>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {officeHours.map((hours) => (
                    <div key={hours.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {language === 'en' ? hours.dayEn : hours.day}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {hours.startTime} - {hours.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Form */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                {language === 'en' ? 'Share Your Feedback' : 'तुमचा अभिप्राय सामायिक करा'}
              </CardTitle>
              <p className="text-gray-600 text-center">
                {language === 'en' 
                  ? 'Help us improve our services by sharing your thoughts and suggestions'
                  : 'तुमचे विचार आणि सूचना सामायिक करून आमच्या सेवा सुधारण्यात मदत करा'
                }
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Name' : 'नाव'} *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'en' ? 'Enter your name' : 'तुमचे नाव प्रविष्ट करा'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Email' : 'ईमेल'} *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'en' ? 'Enter your email' : 'तुमचा ईमेल प्रविष्ट करा'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Category' : 'श्रेणी'} *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">{language === 'en' ? 'Select category' : 'श्रेणी निवडा'}</option>
                      <option value="general">{language === 'en' ? 'General' : 'सामान्य'}</option>
                      <option value="complaint">{language === 'en' ? 'Complaint' : 'तक्रार'}</option>
                      <option value="suggestion">{language === 'en' ? 'Suggestion' : 'सूचना'}</option>
                      <option value="compliment">{language === 'en' ? 'Compliment' : 'प्रशंसा'}</option>
                      <option value="technical">{language === 'en' ? 'Technical' : 'तांत्रिक'}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Subject' : 'विषय'} *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'en' ? 'Enter subject' : 'विषय प्रविष्ट करा'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Rating' : 'रेटिंग'} *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-yellow-50 hover:border-yellow-300"
                        >
                          <Star className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Message' : 'संदेश'} *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'en' ? 'Enter your message' : 'तुमचा संदेश प्रविष्ट करा'}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Submit Feedback' : 'अभिप्राय सबमिट करा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        {feedback.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Recent Feedback' : 'अलीकडील अभिप्राय'}
              </h3>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                {language === 'en' ? 'View All Feedback' : 'सर्व अभिप्राय पहा'}
              </Button>
            </div>

            <div className="space-y-12">
              {Object.entries(groupedFeedback).map(([category, categoryFeedback]) => {
                const categoryInfo = getFeedbackCategoryInfo(category);
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
                      <Badge className="bg-gray-100 text-gray-800">
                        {categoryFeedback.length} {language === 'en' ? 'Feedback' : 'अभिप्राय'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryFeedback.slice(0, 6).map((item) => {
                        const statusInfo = getStatusInfo(item.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <Card key={item.id} className="hover:shadow-lg transition-all duration-300 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                  {language === 'en' ? item.subjectEn : item.subject}
                                </CardTitle>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">
                                  {item.name}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < item.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {language === 'en' ? item.messageEn : item.message}
                              </p>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>
                                    {language === 'en' ? 'Submitted' : 'सबमिट केले'}: {new Date(item.createdAt).toLocaleDateString()}
                                  </span>
                                  <span>
                                    {language === 'en' ? 'Updated' : 'अद्यतनित'}: {new Date(item.updatedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {item.response && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {language === 'en' ? item.responseEn : item.response}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {categoryFeedback.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${categoryFeedback.length - 6} More Feedback` 
                            : `${categoryFeedback.length - 6} अधिक अभिप्राय पहा`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <MessageSquare className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Contact Us Now' : 'आता आमच्याशी संपर्क साधा'}
          </Button>
        </div>
      </div>
    </section>
  );
}