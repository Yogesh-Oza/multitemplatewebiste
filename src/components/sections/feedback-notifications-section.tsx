'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Bell, 
  Send, 
  CheckCircle, 
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Info,
  Calendar,
  User,
  Mail,
  Phone,
  ExternalLink,
  ArrowRight,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Feedback {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: 'suggestion' | 'complaint' | 'appreciation' | 'general';
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  submittedDate: string;
  responseDate?: string;
  response?: string;
  rating?: number;
  submittedBy: string;
  icon: any;
  color: string;
}

interface Notification {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  date: string;
  isRead: boolean;
  actionUrl?: string;
  icon: any;
  color: string;
}

const demoFeedback: Feedback[] = [
  {
    id: 'feedback-1',
    title: 'पाणी पुरवठा सुधारणा',
    titleEn: 'Water Supply Improvement',
    description: 'पाणी पुरवठा वेळेच्या बाबतीत सुधारणा करावी. सध्या पाणी फक्त सकाळी ६-८ वाजेपर्यंत येतो.',
    category: 'suggestion',
    status: 'responded',
    submittedDate: '2024-03-20',
    responseDate: '2024-03-22',
    response: 'आपला सुझाव लक्षात घेऊन पाणी पुरवठा वेळ ६-१० वाजेपर्यंत वाढविण्यात आला आहे.',
    rating: 4,
    submittedBy: 'राजेश पाटील',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    id: 'feedback-2',
    title: 'शाळेची सुविधा',
    titleEn: 'School Facilities',
    description: 'शाळेमध्ये संगणक प्रयोगशाळा आणि पुस्तकालय सुविधा उत्तम आहेत. धन्यवाद!',
    category: 'appreciation',
    status: 'reviewed',
    submittedDate: '2024-03-18',
    submittedBy: 'सुनीता देशमुख',
    icon: Star,
    color: 'bg-green-500'
  },
  {
    id: 'feedback-3',
    title: 'रस्ते दुरुस्ती',
    titleEn: 'Road Repair',
    description: 'मुख्य रस्त्यावरील खड्डे दुरुस्त करावेत. वाहतूक अडचणी होत आहे.',
    category: 'complaint',
    status: 'pending',
    submittedDate: '2024-03-25',
    submittedBy: 'विकास शिंदे',
    icon: AlertCircle,
    color: 'bg-red-500'
  }
];

const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'नवीन योजना सुरू',
    titleEn: 'New Scheme Launched',
    description: 'पीएम आवास योजना अंतर्गत नवीन घरे बांधण्यासाठी अर्ज मागविण्यात येत आहेत.',
    type: 'info',
    priority: 'high',
    date: '2024-03-25',
    isRead: false,
    actionUrl: '/schemes/pm-awas',
    icon: Info,
    color: 'bg-blue-500'
  },
  {
    id: 'notif-2',
    title: 'ग्रामसभा बैठक',
    titleEn: 'Gram Sabha Meeting',
    description: '३० मार्च २०२४ रोजी सकाळी १० वाजेपासून ग्रामसभा बैठक आहे.',
    type: 'info',
    priority: 'medium',
    date: '2024-03-24',
    isRead: true,
    actionUrl: '/meetings',
    icon: Calendar,
    color: 'bg-green-500'
  },
  {
    id: 'notif-3',
    title: 'कर भरणा आठवण',
    titleEn: 'Tax Payment Reminder',
    description: 'मालमत्ता कर भरण्याची अंतिम मुदत ३१ मार्च २०२४ आहे.',
    type: 'warning',
    priority: 'high',
    date: '2024-03-23',
    isRead: false,
    actionUrl: '/tax-payment',
    icon: AlertCircle,
    color: 'bg-yellow-500'
  }
];

export function FeedbackNotificationsSection() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feedback' | 'notifications'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showNewFeedback, setShowNewFeedback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedback(demoFeedback);
      setNotifications(demoNotifications);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mr-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'प्रलंबित', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'reviewed':
        return { label: 'पुनरावलोकन', color: 'bg-blue-100 text-blue-800', icon: Eye };
      case 'responded':
        return { label: 'उत्तर दिले', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'closed':
        return { label: 'बंद', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'suggestion':
        return { label: 'सुझाव', color: 'bg-blue-100 text-blue-800', icon: MessageSquare };
      case 'complaint':
        return { label: 'तक्रार', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      case 'appreciation':
        return { label: 'प्रशंसा', color: 'bg-green-100 text-green-800', icon: Star };
      case 'general':
        return { label: 'सामान्य', color: 'bg-gray-100 text-gray-800', icon: Info };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: MessageSquare };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'info':
        return { label: 'माहिती', color: 'bg-blue-100 text-blue-800', icon: Info };
      case 'success':
        return { label: 'यश', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'warning':
        return { label: 'चेतावणी', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'error':
        return { label: 'त्रुटी', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: Info };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'low':
        return { label: 'कमी', color: 'bg-green-100 text-green-800' };
      case 'medium':
        return { label: 'मध्यम', color: 'bg-yellow-100 text-yellow-800' };
      case 'high':
        return { label: 'उच्च', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">फीडबॅक माहिती लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white mr-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              फीडबॅक आणि सूचना
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            आपले सुझाव, तक्रारी आणि महत्त्वाच्या सूचना - सतत संवाद साधा
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <Button
              variant={activeTab === 'feedback' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('feedback')}
              className="relative"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              फीडबॅक
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('notifications')}
              className="relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              सूचना
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {activeTab === 'feedback' ? (
            <Button
              onClick={() => setShowNewFeedback(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              नवीन फीडबॅक
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => window.open('/notifications', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              सर्व सूचना पहा
            </Button>
          )}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'feedback' ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {feedback.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="h-16 w-16 text-gray-400 mx-auto mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    कोणतेही फीडबॅक सापडले नाही
                  </h3>
                  <p className="text-gray-500">
                    अद्याप कोणतेही फीडबॅक सबमिट केले गेले नाही
                  </p>
                </motion.div>
              ) : (
                feedback.map((item, index) => {
                  const statusInfo = getStatusInfo(item.status);
                  const categoryInfo = getCategoryInfo(item.category);
                  const StatusIcon = statusInfo.icon;
                  const CategoryIcon = categoryInfo.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="transform transition-all duration-300"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${item.color} text-white`}>
                                <CategoryIcon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {item.title}
                                  </h3>
                                  <Badge className={statusInfo.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                  <Badge className={categoryInfo.color}>
                                    {categoryInfo.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {item.submittedBy}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(item.submittedDate)}
                                  </span>
                                  {item.rating && (
                                    <span className="flex items-center">
                                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                      {item.rating}/5
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedFeedback(item)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                तपशील
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {notifications.map((notification, index) => {
                const typeInfo = getTypeInfo(notification.type);
                const priorityInfo = getPriorityInfo(notification.priority);
                const TypeIcon = typeInfo.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="transform transition-all duration-300"
                  >
                    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      !notification.isRead ? 'border-l-4 border-blue-500' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${notification.color} text-white`}>
                              <TypeIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {notification.title}
                                </h3>
                                <Badge className={typeInfo.color}>
                                  {typeInfo.label}
                                </Badge>
                                <Badge className={priorityInfo.color}>
                                  {priorityInfo.label}
                                </Badge>
                                {!notification.isRead && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    नवीन
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                onClick={() => window.open(notification.actionUrl, '_blank')}
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                पहा
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Details Modal */}
        <AnimatePresence>
          {selectedFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedFeedback(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${selectedFeedback.color} text-white`}>
                        <selectedFeedback.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedFeedback.title}</h3>
                        <p className="text-gray-600">{selectedFeedback.titleEn}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFeedback(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">वर्णन</h4>
                      <p className="text-gray-600">{selectedFeedback.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">सबमिट केले</h5>
                        <p className="text-gray-600">{selectedFeedback.submittedBy}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">दिनांक</h5>
                        <p className="text-gray-600">{formatDate(selectedFeedback.submittedDate)}</p>
                      </div>
                    </div>

                    {selectedFeedback.response && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">उत्तर</h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-gray-700">{selectedFeedback.response}</p>
                          {selectedFeedback.responseDate && (
                            <p className="text-sm text-gray-500 mt-2">
                              उत्तर दिनांक: {formatDate(selectedFeedback.responseDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedFeedback.rating && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">रेटिंग</h4>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= selectedFeedback.rating! 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-gray-600">
                            {selectedFeedback.rating}/5
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">संपर्क माहिती</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4 inline-flex">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">फोन</h4>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-pink-100 text-pink-600 mb-4 inline-flex">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">ईमेल</h4>
              <p className="text-gray-600">feedback@grampanchayat.gov.in</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4 inline-flex">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">कामकाजाची वेळ</h4>
              <p className="text-gray-600">सोम-शनि: ९:०० - ५:००</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
