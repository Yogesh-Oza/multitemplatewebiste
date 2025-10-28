'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Phone, 
  Flame, 
  Stethoscope, 
  Zap, 
  TreePine, 
  Users, 
  AlertTriangle, 
  Heart,
  Building,
  Car,
  Wrench
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  nameEn: string;
  phone: string;
  description: string;
  icon: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function CompleteEmergencyContactsSection() {
  // Complete emergency contacts as per GR requirements
  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'पोलीस',
      nameEn: 'Police',
      phone: '100 / +91 12345 11111',
      description: 'आपत्कालीन प्रसंगी त्वरित सहाय्य',
      icon: 'Shield',
      color: 'from-blue-500 to-indigo-600',
      priority: 'high',
      category: 'सुरक्षा'
    },
    {
      id: '2',
      name: 'रुग्णवाहिका',
      nameEn: 'Ambulance',
      phone: '108 / +91 12345 22222',
      description: 'आरोग्य आपत्कालीन सेवा',
      icon: 'Stethoscope',
      color: 'from-red-500 to-pink-600',
      priority: 'high',
      category: 'आरोग्य'
    },
    {
      id: '3',
      name: 'अग्निशमन',
      nameEn: 'Fire Department',
      phone: '101 / +91 12345 33333',
      description: 'अग्निशमन आणि बचाव सेवा',
      icon: 'Flame',
      color: 'from-orange-500 to-red-600',
      priority: 'high',
      category: 'सुरक्षा'
    },
    {
      id: '4',
      name: 'आरोग्य केंद्र',
      nameEn: 'Health Center',
      phone: '+91 12345 44444',
      description: 'प्राथमिक आरोग्य सेवा',
      icon: 'Heart',
      color: 'from-green-500 to-emerald-600',
      priority: 'medium',
      category: 'आरोग्य'
    },
    {
      id: '5',
      name: 'आपत्ती व्यवस्थापन',
      nameEn: 'Disaster Management',
      phone: '+91 12345 55555',
      description: 'नैसर्गिक आपत्ती व्यवस्थापन',
      icon: 'AlertTriangle',
      color: 'from-yellow-500 to-orange-600',
      priority: 'high',
      category: 'आपत्ती'
    },
    {
      id: '6',
      name: 'MSEB (वीज)',
      nameEn: 'Electricity Department',
      phone: '+91 12345 66666',
      description: 'वीजपुरवठा आणि दुरुस्ती',
      icon: 'Zap',
      color: 'from-yellow-400 to-yellow-600',
      priority: 'medium',
      category: 'सुविधा'
    },
    {
      id: '7',
      name: 'FPO गट',
      nameEn: 'FPO Group',
      phone: '+91 12345 77777',
      description: 'कृषी उत्पादक संघ',
      icon: 'TreePine',
      color: 'from-green-600 to-teal-600',
      priority: 'low',
      category: 'कृषी'
    },
    {
      id: '8',
      name: 'वन विभाग',
      nameEn: 'Forest Department',
      phone: '+91 12345 88888',
      description: 'वन संरक्षण आणि व्यवस्थापन',
      icon: 'TreePine',
      color: 'from-green-700 to-green-800',
      priority: 'low',
      category: 'पर्यावरण'
    },
    {
      id: '9',
      name: 'पाणीपुरवठा',
      nameEn: 'Water Supply',
      phone: '+91 12345 99999',
      description: 'पाणीपुरवठा आणि दुरुस्ती',
      icon: 'Wrench',
      color: 'from-cyan-500 to-blue-600',
      priority: 'medium',
      category: 'सुविधा'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="h-6 w-6" />;
      case 'Stethoscope':
        return <Stethoscope className="h-6 w-6" />;
      case 'Flame':
        return <Flame className="h-6 w-6" />;
      case 'Heart':
        return <Heart className="h-6 w-6" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-6 w-6" />;
      case 'Zap':
        return <Zap className="h-6 w-6" />;
      case 'TreePine':
        return <TreePine className="h-6 w-6" />;
      case 'Wrench':
        return <Wrench className="h-6 w-6" />;
      default:
        return <Phone className="h-6 w-6" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'तातडीचे';
      case 'medium':
        return 'मध्यम';
      case 'low':
        return 'सामान्य';
      default:
        return 'सामान्य';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <AlertTriangle className="h-4 w-4" />
            आपत्कालीन संपर्क
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            मुख्य संपर्क क्रमांक / आपत्कालीन संपर्क
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            सर्व आपत्कालीन प्रसंगांसाठी त्वरित संपर्क माहिती
          </p>
        </motion.div>

        {/* Emergency Contacts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {emergencyContacts.map((contact, index) => (
            <motion.div key={contact.id} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <CardContent className="p-6">
                  {/* Contact Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${contact.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {getIcon(contact.icon)}
                    </div>
                    <Badge className={`${getPriorityColor(contact.priority)} border`}>
                      {getPriorityText(contact.priority)}
                    </Badge>
                  </div>

                  {/* Contact Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-3">
                    {contact.nameEn}
                  </p>

                  {/* Phone Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <a 
                      href={`tel:${contact.phone.split(' / ')[1] || contact.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {contact.description}
                  </p>

                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {contact.category}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Emergency Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">आपत्कालीन सूचना</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">तातडीचे प्रसंग (100, 108, 101):</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• त्वरित फोन करा</li>
                      <li>• स्थान आणि समस्या स्पष्ट सांगा</li>
                      <li>• फोन बंद करू नका</li>
                      <li>• मदत येईपर्यंत प्रतीक्षा करा</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">सामान्य प्रसंग:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• कार्यालयीन वेळेत संपर्क करा</li>
                      <li>• समस्या लिहून ठेवा</li>
                      <li>• आवश्यक कागदपत्रे तयार करा</li>
                      <li>• अनुवर्ती कृती घ्या</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
