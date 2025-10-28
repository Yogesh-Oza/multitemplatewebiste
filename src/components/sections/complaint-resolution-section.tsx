'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  FileText,
  Shield,
  Building,
  Heart,
  BookOpen,
  Home,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Complaint {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: 'infrastructure' | 'water' | 'electricity' | 'sanitation' | 'education' | 'health' | 'other';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  resolvedDate?: string;
  assignedTo: string;
  complaintNumber: string;
  icon: any;
  color: string;
}

const demoComplaints: Complaint[] = [
  {
    id: 'complaint-1',
    title: 'रस्त्यावरील खड्डे दुरुस्ती',
    titleEn: 'Road Pothole Repair',
    description: 'मुख्य रस्त्यावर मोठे खड्डे आहेत ज्यामुळे वाहतूक अडचणी होत आहे.',
    category: 'infrastructure',
    status: 'resolved',
    priority: 'high',
    submittedDate: '2024-03-15',
    resolvedDate: '2024-03-20',
    assignedTo: 'पीडब्ल्यूडी विभाग',
    complaintNumber: 'CP-2024-001',
    icon: Building,
    color: 'bg-blue-500'
  },
  {
    id: 'complaint-2',
    title: 'पाणी पुरवठा समस्या',
    titleEn: 'Water Supply Issue',
    description: 'आमच्या वाड्यात ३ दिवसांपासून पाणी येत नाही.',
    category: 'water',
    status: 'in_progress',
    priority: 'urgent',
    submittedDate: '2024-03-22',
    assignedTo: 'पाणी पुरवठा विभाग',
    complaintNumber: 'CP-2024-002',
    icon: Heart,
    color: 'bg-cyan-500'
  },
  {
    id: 'complaint-3',
    title: 'वीज पुरवठा अडचण',
    titleEn: 'Electricity Supply Problem',
    description: 'रात्री ८ ते १० वाजेपर्यंत वीज येत नाही.',
    category: 'electricity',
    status: 'pending',
    priority: 'medium',
    submittedDate: '2024-03-25',
    assignedTo: 'वीज विभाग',
    complaintNumber: 'CP-2024-003',
    icon: Shield,
    color: 'bg-yellow-500'
  }
];

export function ComplaintResolutionSection() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showNewComplaint, setShowNewComplaint] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplaints(demoComplaints);
      setLoading(false);
    };

    fetchComplaints();
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
      case 'in_progress':
        return { label: 'प्रगतीत', color: 'bg-blue-100 text-blue-800', icon: TrendingUp };
      case 'resolved':
        return { label: 'निराकरण', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'rejected':
        return { label: 'नाकारले', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'low':
        return { label: 'कमी', color: 'bg-green-100 text-green-800' };
      case 'medium':
        return { label: 'मध्यम', color: 'bg-yellow-100 text-yellow-800' };
      case 'high':
        return { label: 'उच्च', color: 'bg-orange-100 text-orange-800' };
      case 'urgent':
        return { label: 'तातडीचे', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'infrastructure':
        return { label: 'पायाभूत सुविधा', color: 'bg-blue-100 text-blue-800', icon: Building };
      case 'water':
        return { label: 'पाणी', color: 'bg-cyan-100 text-cyan-800', icon: Heart };
      case 'electricity':
        return { label: 'वीज', color: 'bg-yellow-100 text-yellow-800', icon: Shield };
      case 'sanitation':
        return { label: 'स्वच्छता', color: 'bg-purple-100 text-purple-800', icon: Home };
      case 'education':
        return { label: 'शिक्षण', color: 'bg-green-100 text-green-800', icon: BookOpen };
      case 'health':
        return { label: 'आरोग्य', color: 'bg-red-100 text-red-800', icon: Heart };
      case 'other':
        return { label: 'इतर', color: 'bg-gray-100 text-gray-800', icon: FileText };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  const filteredComplaints = selectedStatus === 'all' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === selectedStatus);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">तक्रार माहिती लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white mr-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              तक्रार निवारण पोर्टल
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            आपल्या समस्यांचे त्वरित निराकरण - पारदर्शक आणि कार्यक्षम
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">एकूण तक्रारी</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <MessageSquare className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">प्रलंबित</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">प्रगतीत</p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">निराकरण</p>
                  <p className="text-3xl font-bold">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button
            onClick={() => setShowNewComplaint(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन तक्रार
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/complaint-portal', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            पोर्टलवर जा
          </Button>
        </motion.div>

        {/* Status Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
            size="sm"
          >
            सर्व तक्रारी
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('pending')}
            size="sm"
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
          >
            <Clock className="h-4 w-4 mr-2" />
            प्रलंबित
          </Button>
          <Button
            variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('in_progress')}
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            प्रगतीत
          </Button>
          <Button
            variant={selectedStatus === 'resolved' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('resolved')}
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            निराकरण
          </Button>
        </motion.div>

        {/* Complaints List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-6"
        >
          {filteredComplaints.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                कोणतीही तक्रार सापडली नाही
              </h3>
              <p className="text-gray-500">
                {selectedStatus === 'all' 
                  ? 'अद्याप कोणतीही तक्रार दाखल केली गेली नाही'
                  : `${selectedStatus} तक्रारी नाहीत`
                }
              </p>
            </motion.div>
          ) : (
            filteredComplaints.map((complaint, index) => {
              const statusInfo = getStatusInfo(complaint.status);
              const priorityInfo = getPriorityInfo(complaint.priority);
              const categoryInfo = getCategoryInfo(complaint.category);
              const StatusIcon = statusInfo.icon;
              const CategoryIcon = categoryInfo.icon;

              return (
                <motion.div
                  key={complaint.id}
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
                          <div className={`p-3 rounded-xl ${complaint.color} text-white`}>
                            <CategoryIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {complaint.title}
                              </h3>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              <Badge className={priorityInfo.color}>
                                {priorityInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(complaint.submittedDate)}
                              </span>
                              <span>तक्रार क्र.: {complaint.complaintNumber}</span>
                              <span>जबाबदार: {complaint.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedComplaint(complaint)}
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

        {/* Complaint Details Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedComplaint(null)}
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
                      <div className={`p-3 rounded-xl ${selectedComplaint.color} text-white`}>
                        <selectedComplaint.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedComplaint.title}</h3>
                        <p className="text-gray-600">{selectedComplaint.titleEn}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedComplaint(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">वर्णन</h4>
                      <p className="text-gray-600">{selectedComplaint.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">तक्रार क्रमांक</h5>
                        <p className="text-gray-600">{selectedComplaint.complaintNumber}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">जबाबदार</h5>
                        <p className="text-gray-600">{selectedComplaint.assignedTo}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">दाखल दिनांक</h5>
                        <p className="text-gray-600">{formatDate(selectedComplaint.submittedDate)}</p>
                      </div>
                      {selectedComplaint.resolvedDate && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">निराकरण दिनांक</h5>
                          <p className="text-gray-600">{formatDate(selectedComplaint.resolvedDate)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1"
                        onClick={() => window.open('/complaint-portal', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        पोर्टलवर जा
                      </Button>
                    </div>
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
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">संपर्क माहिती</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mb-4 inline-flex">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">तक्रार हॉटलाइन</h4>
              <p className="text-gray-600">+91 1800 123 4567</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mb-4 inline-flex">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">ईमेल</h4>
              <p className="text-gray-600">complaints@grampanchayat.gov.in</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4 inline-flex">
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
