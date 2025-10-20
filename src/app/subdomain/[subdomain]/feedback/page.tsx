'use client';

import { useState } from 'react';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { Send, CheckCircle, AlertCircle, Search, FileText, MessageSquare, Clock, TrendingUp, Phone, Mail } from 'lucide-react';

interface FeedbackFormData {
  type: string;
  subject: string;
  description: string;
  citizenName: string;
  phone: string;
  email: string;
  priority: string;
}

interface TrackingResult {
  id: string;
  subject: string;
  status: string;
  priority: string;
  trackingCode: string;
  history: any[];
  createdAt: string;
  updatedAt: string;
}

export default async function FeedbackPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'complaint',
    subject: '',
    description: '',
    citizenName: '',
    phone: '',
    email: '',
    priority: 'medium'
  });
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitSuccess(true);
        setFormData({
          type: 'complaint',
          subject: '',
          description: '',
          citizenName: '',
          phone: '',
          email: '',
          priority: 'medium'
        });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTrackingError('');

    try {
      const response = await fetch(`/api/complaints/track?code=${trackingCode}`);

      if (response.ok) {
        const result = await response.json();
        setTrackingResult(result);
      } else {
        setTrackingError('तक्रार सापडली नाही. कृपया योग्य ट्रॅकिंग कोड प्रविष्ट करा.');
      }
    } catch (error) {
      setTrackingError('ट्रॅकिंग करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'निराकरण झाले';
      case 'in_progress':
        return 'प्रगतीत';
      case 'pending':
        return 'प्रलंबित';
      case 'closed':
        return 'बंद';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'closed':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                तक्रार निवारण आणि फीडबॅक
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                आपल्या समस्या, सूचना आणि अभिप्राय आम्हाला कळवा. आम्ही त्वरित कारवाई करू.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'submit'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <MessageSquare className="h-5 w-5 inline mr-2" />
                तक्रार/सूचना सबमिट करा
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'track'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Search className="h-5 w-5 inline mr-2" />
                स्थिती तपासा
              </button>
            </div>
          </div>

          {/* Submit Form */}
          {activeTab === 'submit' && (
            <div className="max-w-2xl mx-auto">
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    तक्रार यशस्वीरित्या सबमिट झाली!
                  </h3>
                  <p className="text-green-600">
                    आपली तक्रार प्राप्त झाली आहे. आम्ही त्वरित कारवाई करू.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    तक्रार/सूचना फॉर्म
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          प्रकार *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="complaint">तक्रार</option>
                          <option value="suggestion">सूचना</option>
                          <option value="grievance">ग्राहक तक्रार</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          प्राधान्य *
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="low">कमी</option>
                          <option value="medium">मध्यम</option>
                          <option value="high">उच्च</option>
                          <option value="urgent">तातडीचे</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        विषय *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="तक्रार/सूचनेचा विषय"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        तपशील *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="तक्रार/सूचनेचा तपशील लिहा..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाव *
                        </label>
                        <input
                          type="text"
                          value={formData.citizenName}
                          onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="आपले पूर्ण नाव"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          मोबाइल नंबर *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ईमेल (पर्यायी)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="example@email.com"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          सबमिट करत आहे...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          सबमिट करा
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Tracking */}
          {activeTab === 'track' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  तक्रार स्थिती तपासा
                </h2>
                
                <form onSubmit={handleTracking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ट्रॅकिंग कोड
                    </label>
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="GP1234567890ABCD"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isTracking}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isTracking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        तपासत आहे...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        स्थिती तपासा
                      </>
                    )}
                  </button>
                </form>

                {trackingError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span>{trackingError}</span>
                    </div>
                  </div>
                )}

                {trackingResult && (
                  <div className="mt-6 space-y-6">
                    {/* Main Complaint Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        तक्रार माहिती
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">विषय:</span>
                            <p className="text-gray-900">{trackingResult.subject}</p>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-600">ट्रॅकिंग कोड:</span>
                            <p className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {trackingResult.trackingCode}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">स्थिती:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                                {getStatusText(trackingResult.status)}
                              </span>
                              {getStatusIcon(trackingResult.status)}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-600">प्राधान्य:</span>
                            <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                              trackingResult.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              trackingResult.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              trackingResult.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {trackingResult.priority === 'urgent' ? 'तातडीचे' :
                               trackingResult.priority === 'high' ? 'उच्च' :
                               trackingResult.priority === 'medium' ? 'मध्यम' : 'कमी'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status History */}
                    {trackingResult.history && trackingResult.history.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-indigo-600" />
                          स्थिती इतिहास
                        </h4>
                        <div className="space-y-4">
                          {trackingResult.history.map((entry: any, index: number) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900">{entry.note}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(entry.date).toLocaleDateString('mr-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Escalation Section */}
                    {trackingResult.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          तक्रार वाढवणे (Complaint Escalation)
                        </h4>
                        <p className="text-yellow-700 mb-4">
                          जर तुमची तक्रार ७ दिवसांपेक्षा जास्त काळ प्रलंबित असेल, तर तुम्ही ती वरिष्ठ अधिकाऱ्यांकडे वाढवू शकता.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                            <Phone className="h-4 w-4" />
                            फोन करा
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                            <Mail className="h-4 w-4" />
                            ईमेल करा
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        संपर्क माहिती
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700"><strong>ग्रामपंचायत कार्यालय:</strong></p>
                          <p className="text-blue-600">फोन: 022-12345678</p>
                          <p className="text-blue-600">ईमेल: office@grampanchayat.gov.in</p>
                        </div>
                        <div>
                          <p className="text-blue-700"><strong>तक्रार निवारण अधिकारी:</strong></p>
                          <p className="text-blue-600">फोन: 022-87654321</p>
                          <p className="text-blue-600">ईमेल: grievance@grampanchayat.gov.in</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SubdomainValidator>
  );
}
