'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Filter, Clock, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const ALL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'पाणीपुरवठा बंदची सूचना',
    date: '२३ मार्च २०२४',
    description: 'गावातील पाणीपुरवठा यंत्रणेच्या देखभालीसाठी २४ मार्च रोजी पाणी बंद राहील.',
    fullDescription: 'गावातील पाणीपुरवठा यंत्रणेच्या देखभालीसाठी २४ मार्च रोजी सकाळी ६ वाजल्यापासून संध्याकाळी ६ वाजेपर्यंत पाणी बंद राहील. सर्व नागरिकांना याची माहिती दिली जाते.',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'पाणीपुरवठा',
    priority: 'high',
    status: 'active',
  },
  {
    id: 2,
    title: 'लसीकरण मोहिम',
    date: '१५ फेब्रुवारी २०२४',
    description: 'उद्या सकाळी १० पासून गावात लसीकरण शिबीर आयोजित करण्यात आले आहे.',
    fullDescription: 'सर्व वयोगटातील नागरिकांसाठी लसीकरण शिबीर आयोजित करण्यात आले आहे. सकाळी १० वाजल्यापासून संध्याकाळी ५ वाजेपर्यंत ग्रामपंचायत कार्यालयात लसीकरण उपलब्ध असेल.',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'आरोग्य',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: 3,
    title: 'रस्त्याचे काम सुरू',
    date: '८ जानेवारी २०२४',
    description: 'मुख्य रस्त्याच्या डांबरीकरणाचे काम सुरू झाले असून ३ दिवसात पूर्ण होणार आहे.',
    fullDescription: 'गावाच्या मुख्य रस्त्यावर डांबरीकरणाचे काम सुरू झाले आहे. या कामामुळे रस्त्यावर वाहतूक अडचणी येऊ शकतात. सर्व नागरिकांना सावधान राहण्याची विनंती.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXHzQbI8CMazDK7mcyIVO4w3rKJ7hxrAkk-FkTmqVcgj_6dvsvIpfzTMBYju6jtAgymV8&usqp=CAU',
    category: 'विकास',
    priority: 'low',
    status: 'active',
  },
  {
    id: 4,
    title: 'विद्युत बिल भरणे',
    date: '१० मार्च २०२४',
    description: 'विद्युत बिलाची अंतिम तारीख १५ मार्च आहे. सर्व नागरिकांना वेळेवर बिल भरण्याची विनंती.',
    fullDescription: 'विद्युत बिलाची अंतिम तारीख १५ मार्च २०२४ आहे. बिल न भरल्यास विद्युत पुरवठा बंद होऊ शकतो. सर्व नागरिकांना वेळेवर बिल भरण्याची विनंती.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'विद्युत',
    priority: 'high',
    status: 'active',
  },
  {
    id: 5,
    title: 'शिक्षण शिबीर',
    date: '२५ फेब्रुवारी २०२४',
    description: 'मुलांसाठी शिक्षण शिबीर आयोजित करण्यात आले आहे.',
    fullDescription: '१० ते १८ वयोगटातील मुलांसाठी शिक्षण शिबीर आयोजित करण्यात आले आहे. या शिबीरात गणित, विज्ञान आणि इंग्रजी या विषयांवर शिकवण्यात येईल.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'शिक्षण',
    priority: 'medium',
    status: 'upcoming',
  },
  {
    id: 6,
    title: 'स्वच्छता अभियान',
    date: '१२ मार्च २०२४',
    description: 'गाव स्वच्छता अभियान सुरू करण्यात आले आहे.',
    fullDescription: 'गाव स्वच्छता अभियान सुरू करण्यात आले आहे. सर्व नागरिकांना स्वच्छता राखण्याची विनंती. कचरा नियोजित ठिकाणी टाकण्याची विनंती.',
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'स्वच्छता',
    priority: 'medium',
    status: 'active',
  },
] as const;

export function AnnouncementsGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const categories = ['all', 'पाणीपुरवठा', 'आरोग्य', 'विकास', 'विद्युत', 'शिक्षण', 'स्वच्छता'];
  const priorities = ['all', 'high', 'medium', 'low'];

  const filteredAnnouncements = ALL_ANNOUNCEMENTS.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">शोधा</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="सूचना शोधा..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">वर्ग</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'सर्व' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">प्राधान्य</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'सर्व' : 
                   priority === 'high' ? 'उच्च' :
                   priority === 'medium' ? 'मध्यम' : 'कमी'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="text-gray-600">
          {filteredAnnouncements.length} सूचना सापडल्या
        </p>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
              <div className="relative">
                <div className="h-48 w-full overflow-hidden">
                  <Image
                    src={announcement.image}
                    alt={announcement.title}
                    width={400}
                    height={220}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Badge className={`${getPriorityColor(announcement.priority)} text-white border-0`}>
                    {announcement.category}
                  </Badge>
                  <Badge className={`${getStatusColor(announcement.status)} border-0`}>
                    {announcement.status === 'active' ? 'सक्रिय' :
                     announcement.status === 'completed' ? 'पूर्ण' : 'येत आहे'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {announcement.title}
                </h3>
                
                <div className="flex items-center mb-3 text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{announcement.date}</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {announcement.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors"
                  >
                    अधिक माहिती
                  </Button>
                  
                  {announcement.priority === 'high' && (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">गरजेचे</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोणतीही सूचना सापडली नाही</h3>
          <p className="text-gray-600">आपल्या शोध निकषांनुसार कोणतीही सूचना सापडली नाही.</p>
        </div>
      )}
    </div>
  );
}
