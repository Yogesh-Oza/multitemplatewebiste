'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Users, 
  Settings, 
  Smartphone, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Star,
  Play,
  Eye,
  Code,
  Palette,
  Languages,
  Database,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Image,
  FileText,
  BarChart3,
  Heart,
  Building,
  School,
  Store,
  Briefcase,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function BusinessLandingPage() {
  const [activeTemplate, setActiveTemplate] = useState('gram-panchayat');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const templates = [
    {
      id: 'gram-panchayat',
      name: 'ग्रामपंचायत',
      nameEn: 'Gram Panchayat',
      description: 'गावाच्या विकासासाठी संपूर्ण वेबसाइट',
      descriptionEn: 'Complete website for village development',
      color: 'from-blue-500 to-purple-600',
      features: ['सूचना व्यवस्थापन', 'गाव माहिती', 'कार्यक्रम', 'गॅलरी', 'संपर्क']
    },
    {
      id: 'business',
      name: 'व्यवसाय',
      nameEn: 'Business',
      description: 'छोट्या व्यवसायासाठी व्यावसायिक वेबसाइट',
      descriptionEn: 'Professional website for small businesses',
      color: 'from-green-500 to-teal-600',
      features: ['उत्पादन', 'सेवा', 'ग्राहक', 'संपर्क', 'किंमत']
    },
    {
      id: 'education',
      name: 'शिक्षण',
      nameEn: 'Education',
      description: 'शाळा आणि शैक्षणिक संस्थांसाठी',
      descriptionEn: 'For schools and educational institutions',
      color: 'from-orange-500 to-red-600',
      features: ['अभ्यासक्रम', 'शिक्षक', 'नोटिस', 'परिणाम', 'प्रवेश']
    },
    {
      id: 'healthcare',
      name: 'आरोग्य',
      nameEn: 'Healthcare',
      description: 'दवाखाने आणि आरोग्य केंद्रांसाठी',
      descriptionEn: 'For clinics and health centers',
      color: 'from-pink-500 to-rose-600',
      features: ['डॉक्टर', 'सेवा', 'अपॉइंटमेंट', 'आरोग्य', 'संपर्क']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'त्वरित सेटअप',
      titleEn: 'Quick Setup',
      description: '5 मिनिटांत वेबसाइट तयार करा',
      descriptionEn: 'Create your website in just 5 minutes'
    },
    {
      icon: Palette,
      title: 'सुंदर टेम्प्लेट्स',
      titleEn: 'Beautiful Templates',
      description: 'तयार केलेले आकर्षक डिझाइन',
      descriptionEn: 'Pre-designed attractive layouts'
    },
    {
      icon: Languages,
      title: 'द्विभाषी समर्थन',
      titleEn: 'Bilingual Support',
      description: 'मराठी आणि इंग्रजी दोन्ही भाषा',
      descriptionEn: 'Support for Marathi and English'
    },
    {
      icon: Settings,
      title: 'सहज व्यवस्थापन',
      titleEn: 'Easy Management',
      description: 'कोडिंगशिवाय सामग्री संपादन',
      descriptionEn: 'Edit content without coding'
    },
    {
      icon: Smartphone,
      title: 'मोबाइल अनुकूल',
      titleEn: 'Mobile Friendly',
      description: 'सर्व डिव्हाइसमध्ये परफेक्ट दिसते',
      descriptionEn: 'Looks perfect on all devices'
    },
    {
      icon: Shield,
      title: 'सुरक्षित आणि विश्वसनीय',
      titleEn: 'Secure & Reliable',
      description: '99.9% अपटाइम गॅरंटी',
      descriptionEn: '99.9% uptime guarantee'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'नोंदणी करा',
      titleEn: 'Register',
      description: 'आपला सबडोमेन निवडा आणि माहिती भरा',
      descriptionEn: 'Choose your subdomain and fill details',
      icon: User
    },
    {
      step: '02',
      title: 'टेम्प्लेट निवडा',
      titleEn: 'Choose Template',
      description: 'आपल्या व्यवसायासाठी योग्य टेम्प्लेट निवडा',
      descriptionEn: 'Select the right template for your business',
      icon: Eye
    },
    {
      step: '03',
      title: 'सामग्री जोडा',
      titleEn: 'Add Content',
      description: 'आपली माहिती, फोटो आणि सामग्री जोडा',
      descriptionEn: 'Add your information, photos and content',
      icon: FileText
    },
    {
      step: '04',
      title: 'प्रकाशित करा',
      titleEn: 'Publish',
      description: 'एक क्लिकमध्ये आपली वेबसाइट लाइव्ह करा',
      descriptionEn: 'Go live with your website in one click',
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 mb-8"
            >
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">#1 Template Platform in Maharashtra</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                आपली वेबसाइट
              </span>
              <br />
              <span className="text-gray-800">5 मिनिटांत तयार करा</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              कोडिंगशिवाय, तयार टेम्प्लेट्ससह, मराठी-इंग्रजी द्विभाषी वेबसाइट तयार करा
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto"
            >
              Create professional websites without coding, with ready templates, in Marathi-English bilingual
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/subdomain-register">
                  <Globe className="h-5 w-5 mr-2" />
                  मोफत सुरु करा
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-700 px-8 py-4 text-lg font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                डेमो पहा
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                मोफत नोंदणी
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                कोडिंग नाही
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                24/7 सपोर्ट
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              कशासाठी निवडावे?
              <span className="block text-2xl md:text-3xl text-gray-600 mt-2">Why Choose Us?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              आपल्या व्यवसायासाठी सर्वोत्तम वेबसाइट तयार करण्यासाठी सर्व आवश्यक सुविधा
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                      <span className="block text-sm text-gray-600">{feature.titleEn}</span>
                    </h3>
                    <p className="text-gray-600 mb-2">{feature.description}</p>
                    <p className="text-sm text-gray-500">{feature.descriptionEn}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              तयार टेम्प्लेट्स
              <span className="block text-2xl md:text-3xl text-gray-600 mt-2">Ready Templates</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              विविध व्यवसायांसाठी तयार केलेले सुंदर आणि व्यावसायिक टेम्प्लेट्स
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`cursor-pointer ${activeTemplate === template.id ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setActiveTemplate(template.id)}
              >
                <Card className={`h-full p-6 transition-all duration-300 hover:shadow-xl ${
                  activeTemplate === template.id ? 'shadow-xl scale-105' : 'hover:scale-105'
                }`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${template.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {template.id === 'gram-panchayat' && <Building className="h-8 w-8 text-white" />}
                      {template.id === 'business' && <Briefcase className="h-8 w-8 text-white" />}
                      {template.id === 'education' && <School className="h-8 w-8 text-white" />}
                      {template.id === 'healthcare' && <Heart className="h-8 w-8 text-white" />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                      <span className="block text-sm text-gray-600">{template.nameEn}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <p className="text-xs text-gray-500 mb-4">{template.descriptionEn}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Template Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gray-100 px-6 py-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-4 text-sm text-gray-600">
                {activeTemplate === 'gram-panchayat' ? 'pune.mahagp.in' : `${activeTemplate}.mahagp.in`}
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-6">
                <h3 className="text-2xl font-bold mb-2">आमच्या गावात स्वागत आहे</h3>
                <p className="text-blue-100">एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">सूचना</h4>
                  <p className="text-sm text-gray-600">गाव कार्यालयाकडून महत्त्वाच्या सूचना</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">कार्यक्रम</h4>
                  <p className="text-sm text-gray-600">आगामी कार्यक्रम आणि उत्सव</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">संपर्क</h4>
                  <p className="text-sm text-gray-600">ग्रामपंचायत कार्यालय संपर्क</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              कसे काम करते?
              <span className="block text-2xl md:text-3xl text-gray-600 mt-2">How It Works?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              फक्त 4 सोप्या चरणांमध्ये आपली वेबसाइट तयार करा
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform translate-x-10"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                  <span className="block text-sm text-gray-600">{step.titleEn}</span>
                </h3>
                <p className="text-gray-600">{step.description}</p>
                <p className="text-sm text-gray-500 mt-2">{step.descriptionEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              आजच सुरु करा!
              <span className="block text-2xl md:text-3xl text-blue-100 mt-2">Start Today!</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              आपली वेबसाइट तयार करण्यासाठी आजच नोंदणी करा. मोफत, वेगवान आणि सोपे!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/subdomain-register">
                  <Globe className="h-5 w-5 mr-2" />
                  मोफत नोंदणी करा
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <div className="text-white/80 text-sm">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                कोडिंग नाही • मोफत • 5 मिनिटांत तयार
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">महागप.इन</h3>
              <p className="text-gray-400 mb-4">
                महाराष्ट्रातील सर्वोत्तम वेबसाइट टेम्प्लेट प्लॅटफॉर्म
              </p>
              <div className="flex space-x-4">
                <Mail className="h-5 w-5 text-gray-400" />
                <Phone className="h-5 w-5 text-gray-400" />
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">सेवा</h4>
              <ul className="space-y-2 text-gray-400">
                <li>वेबसाइट टेम्प्लेट्स</li>
                <li>डोमेन नाव</li>
                <li>होस्टिंग</li>
                <li>सपोर्ट</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">टेम्प्लेट्स</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ग्रामपंचायत</li>
                <li>व्यवसाय</li>
                <li>शिक्षण</li>
                <li>आरोग्य</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">संपर्क</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@mahagp.in</li>
                <li>+91 12345 67890</li>
                <li>महाराष्ट्र, भारत</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 महागप.इन. सर्व हक्क राखीव.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
