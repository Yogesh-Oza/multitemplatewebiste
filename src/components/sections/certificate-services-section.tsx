'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  User,
  Heart,
  Home,
  GraduationCap,
  Shield,
  Building,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificateService {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: 'birth' | 'death' | 'rts' | 'other';
  status: 'available' | 'coming_soon' | 'maintenance';
  processingTime: string;
  fees: number;
  requiredDocuments: string[];
  icon: any;
  color: string;
  onlineAvailable: boolean;
  downloadUrl?: string;
  applicationUrl?: string;
}

type CitizenServiceRow = {
  id: string;
  titleMr: string;
  titleEn: string;
  descriptionMr: string;
  descriptionEn: string;
  category: string;
  status: string;
  processingTimeMr: string;
  processingTimeEn: string;
  fees: number;
  requiredDocuments: unknown;
  formUrl?: string | null;
  applicationUrl?: string | null;
  iconName: string;
  colorClass: string;
  onlineAvailable: boolean;
};

function serviceIcon(name: string) {
  const map: Record<string, typeof FileText> = {
    User,
    Heart,
    Shield,
    Building,
    Home,
    FileText,
    GraduationCap,
  };
  return map[name] || FileText;
}

function mapCitizenService(row: CitizenServiceRow): CertificateService {
  const docs = Array.isArray(row.requiredDocuments)
    ? (row.requiredDocuments as string[])
    : [];
  const cat = (['birth', 'death', 'rts', 'other'].includes(row.category)
    ? row.category
    : 'other') as CertificateService['category'];
  const st = (['available', 'coming_soon', 'maintenance'].includes(row.status)
    ? row.status
    : 'available') as CertificateService['status'];
  return {
    id: row.id,
    name: row.titleMr,
    nameEn: row.titleEn,
    description: row.descriptionMr,
    descriptionEn: row.descriptionEn,
    category: cat,
    status: st,
    processingTime: row.processingTimeMr || row.processingTimeEn,
    fees: row.fees,
    requiredDocuments: docs,
    icon: serviceIcon(row.iconName),
    color: row.colorClass,
    onlineAvailable: row.onlineAvailable,
    downloadUrl: row.formUrl || undefined,
    applicationUrl: row.applicationUrl || undefined,
  };
}

export function CertificateServicesSection() {
  const [certificateServices, setCertificateServices] = useState<CertificateService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<CertificateService | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/citizen-services');
        if (!response.ok) throw new Error('fetch failed');
        const data: CitizenServiceRow[] = await response.json();
        if (!cancelled) {
          setCertificateServices(data.map(mapCitizenService));
        }
      } catch {
        if (!cancelled) setCertificateServices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mr-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'उपलब्ध', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'coming_soon':
        return { label: 'लवकरच', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'maintenance':
        return { label: 'दुरुस्ती', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'birth':
        return { label: 'जन्म', color: 'bg-blue-100 text-blue-800' };
      case 'death':
        return { label: 'मृत्यू', color: 'bg-red-100 text-red-800' };
      case 'rts':
        return { label: 'RTS', color: 'bg-green-100 text-green-800' };
      case 'other':
        return { label: 'इतर', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredServices = selectedCategory === 'all' 
    ? certificateServices 
    : certificateServices.filter(service => service.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">प्रमाणपत्र सेवा लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  if (certificateServices.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center text-gray-600 max-w-xl mx-auto">
          <FileText className="h-12 w-12 mx-auto mb-4 text-blue-400" />
          <p className="text-lg font-medium text-gray-800">सध्या कोणतीही सेवा नोंदणी केलेली नाही.</p>
          <p className="text-sm mt-2">
            प्रशासन `npm run db:seed` किंवा नागरिक सेवा व्यवस्थापनाद्वारे सेवा जोडू शकते.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mr-4">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              प्रमाणपत्र सेवा
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            सर्व प्रमाणपत्रे ऑनलाइन मिळवा - सोयीस्कर, वेगवान आणि पारदर्शक
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            size="sm"
          >
            सर्व प्रमाणपत्रे
          </Button>
          <Button
            variant={selectedCategory === 'birth' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('birth')}
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <User className="h-4 w-4 mr-2" />
            जन्म
          </Button>
          <Button
            variant={selectedCategory === 'death' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('death')}
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Heart className="h-4 w-4 mr-2" />
            मृत्यू
          </Button>
          <Button
            variant={selectedCategory === 'rts' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('rts')}
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <Shield className="h-4 w-4 mr-2" />
            RTS
          </Button>
          <Button
            variant={selectedCategory === 'other' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('other')}
            size="sm"
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            इतर
          </Button>
        </motion.div>

        {/* Certificate Services Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredServices.map((service, index) => {
            const statusInfo = getStatusInfo(service.status);
            const categoryInfo = getCategoryInfo(service.category);
            const StatusIcon = statusInfo.icon;
            const ServiceIcon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="transform transition-all duration-300"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${service.color} text-white`}>
                        <ServiceIcon className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-800 mb-2">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">प्रक्रिया वेळ:</span>
                        <span className="font-medium">{service.processingTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">शुल्क:</span>
                        <span className="font-medium">{formatAmount(service.fees)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ऑनलाइन:</span>
                        <span className={`font-medium ${service.onlineAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {service.onlineAvailable ? 'होय' : 'नाही'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {service.status === 'available' && service.onlineAvailable ? (
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1" 
                            onClick={() => setSelectedService(service)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            तपशील
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(service.applicationUrl, '_blank')}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          disabled
                          variant="outline"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {service.status === 'coming_soon' ? 'लवकरच उपलब्ध' : 'दुरुस्ती चालू'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedService(null)}
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
                      <div className={`p-3 rounded-xl ${selectedService.color} text-white`}>
                        <selectedService.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedService.name}</h3>
                        <p className="text-gray-600">{selectedService.nameEn}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedService(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">वर्णन</h4>
                      <p className="text-gray-600">{selectedService.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">प्रक्रिया वेळ</h5>
                        <p className="text-gray-600">{selectedService.processingTime}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">शुल्क</h5>
                        <p className="text-gray-600">{formatAmount(selectedService.fees)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">आवश्यक कागदपत्रे</h4>
                      <ul className="space-y-2">
                        {selectedService.requiredDocuments.map((doc, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1"
                        onClick={() => window.open(selectedService.applicationUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        अर्ज करा
                      </Button>
                      {selectedService.downloadUrl && (
                        <Button 
                          variant="outline"
                          onClick={() => window.open(selectedService.downloadUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          डाउनलोड
                        </Button>
                      )}
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
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">संपर्क माहिती</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-4 inline-flex">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">फोन</h4>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mb-4 inline-flex">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">ईमेल</h4>
              <p className="text-gray-600">certificates@grampanchayat.gov.in</p>
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
