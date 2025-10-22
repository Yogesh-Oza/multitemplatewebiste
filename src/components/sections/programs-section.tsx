'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';
import Image from 'next/image';

interface Program {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgramsSectionProps {
  programs: Program[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">येत आहे</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800 border-green-200">सुरू आहे</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">अन्य</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  if (programs.length === 0) {
    return (
      <section id="programs" className="py-16 bg-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">कार्यक्रम</h2>
            <p className="text-gray-600">सध्या कोणतेही कार्यक्रम उपलब्ध नाहीत.</p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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


  return (
    <section id="programs" className="py-16 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">कार्यक्रम</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            गावातील महत्त्वाचे कार्यक्रम, उत्सव आणि सामाजिक कार्यक्रम
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {programs.slice(0, 6).map((program) => (
            <motion.div key={program.id} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="relative">
                  <div className="h-56 w-full overflow-hidden">
                    {program.imageUrl && !program.imageUrl.startsWith('blob:') ? (
                      <Image
                        src={program.imageUrl}
                        alt={program.title}
                        width={400}
                        height={220}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <Calendar className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm font-medium">{program.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getStatusColor(program.status)} text-white border-0`}>
                      {program.status === 'upcoming' ? 'येत आहे' : program.status === 'ongoing' ? 'सुरू आहे' : 'अन्य'}
                    </Badge>
                  </div>
                  {program.category && (
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/90 text-gray-800 border-0">
                        {program.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(program.date).toLocaleDateString('mr-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {program.time && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {program.time}
                      </div>
                    )}
                    
                    {program.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {program.location}
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                  >
                    अधिक माहिती
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Programs Button */}
        {programs.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
              <Users className="mr-2 h-5 w-5" />
              सर्व कार्यक्रम पहा
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
