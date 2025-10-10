'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

interface OfficeDetails {
  id: string;
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  workingHours: string;
  workingHoursEn: string;
  isActive: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  phone: string;
  email?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

interface MapSettings {
  id: string;
  embedUrl: string;
  latitude?: string;
  longitude?: string;
  isActive: boolean;
}

export function ContactSection() {
  const [officeDetails, setOfficeDetails] = useState<OfficeDetails | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [mapSettings, setMapSettings] = useState<MapSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    message: ''
  });

  // Function to extract coordinates from Google Maps embed URL
  const extractCoordinatesFromUrl = (url: string) => {
    try {
      // Handle different Google Maps URL formats
      if (url.includes('maps.app.goo.gl')) {
        // For shortened URLs, we can't extract coordinates directly
        return null;
      }
      
      // Extract coordinates from embed URL patterns
      const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        return {
          latitude: coordMatch[1],
          longitude: coordMatch[2]
        };
      }
      
      // Try to extract from query parameters
      const urlObj = new URL(url);
      const lat = urlObj.searchParams.get('ll')?.split(',')[0];
      const lng = urlObj.searchParams.get('ll')?.split(',')[1];
      
      if (lat && lng) {
        return {
          latitude: lat,
          longitude: lng
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting coordinates:', error);
      return null;
    }
  };

  // Function to convert regular Google Maps URL to embed URL
  const convertToEmbedUrl = (url: string, latitude?: string, longitude?: string) => {
    try {
      // If it's already an embed URL, return as is
      if (url.includes('embed')) {
        return url;
      }
      
      // If we have coordinates, create a simple embed URL
      if (latitude && longitude) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzMzLjAiTiA3M8KwNDYnNTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`;
      }
      
      // Try to extract coordinates from the URL
      const coords = extractCoordinatesFromUrl(url);
      if (coords) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d${coords.longitude}!3d${coords.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzMzLjAiTiA3M8KwNDYnNTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`;
      }
      
      // Fallback to a default embed URL
      return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d73.7810866!3d18.559156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzMzLjAiTiA3M8KwNDYnNTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin';
    } catch (error) {
      console.error('Error converting to embed URL:', error);
      return url; // Return original URL as fallback
    }
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        // Fetch office details
        const officeResponse = await fetch('/api/office-details');
        if (officeResponse.ok) {
          const officeData = await officeResponse.json();
          setOfficeDetails(officeData);
        }

        // Fetch team members
        const teamResponse = await fetch('/api/team-members');
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData.filter((member: TeamMember) => member.isActive));
        }

        // Fetch map settings
        console.log('Fetching map settings...');
        const mapResponse = await fetch('/api/map-settings');
        console.log('Map response status:', mapResponse.status);
        if (mapResponse.ok) {
          const mapData = await mapResponse.json();
          console.log('Map data received:', mapData);
          setMapSettings(mapData);
        } else {
          console.error('Map settings fetch failed:', mapResponse.status, mapResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would typically send the form data to an API
      console.log('Form submitted:', formData);
      toast.success('तुमचा संदेश पाठवला गेला!');
      setFormData({ name: '', mobile: '', message: '' });
    } catch (error) {
      toast.error('संदेश पाठवताना त्रुटी आली');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center text-white">
            <div className="animate-pulse">
              <div className="h-12 bg-white bg-opacity-30 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-white bg-opacity-30 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <style jsx>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.7s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      
      {/* Hero Section */}
      <section 
        className="relative py-24 text-center text-white"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://img.freepik.com/premium-photo/contact-us-business-icon-computer-keyboard-with-globe_117856-2468.jpg") center center/cover no-repeat'
        }}
      >
        <div className="container relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            आमच्याशी संपर्क साधा
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-4xl mx-auto"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            आम्ही तुमची सेवा करण्यासाठी येथे आहोत. कोणत्याही सहाय्यासाठी आमच्याशी संपर्क साधा.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">संपर्क साधा</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              आमच्याशी संपर्क करण्याचे विविध मार्ग
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Office Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <Card className="h-full p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">कार्यालयाचा पत्ता</h3>
                <p className="text-gray-600 leading-relaxed">
                  {officeDetails?.address || 'डेमो गाव\nडेमो तालुका, डेमो जिल्हा\nमहाराष्ट्र - ४१५५१९'}
                </p>
              </Card>
            </motion.div>

            {/* Phone Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group"
            >
              <Card className="h-full p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">फोन क्रमांक</h3>
                <p className="text-gray-600 leading-relaxed">
                  {officeDetails?.phone || '+91 ९१XXXXXXXX'}
                </p>
              </Card>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <Card className="h-full p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">कार्यालयीन वेळा</h3>
                <p className="text-gray-600 leading-relaxed">
                  {officeDetails?.workingHours || 'सोम - शुक्र: सकाळी १० ते सायं. ५\nशनिवार: सकाळी १० ते दुपारी २'}
                </p>
              </Card>
            </motion.div>

            {/* Email Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group"
            >
              <Card className="h-full p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">ईमेल पत्ता</h3>
                <p className="text-gray-600 leading-relaxed">
                  {officeDetails?.email || 'demo@gmail.com'}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ग्रामबॉडी</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              गावाच्या विकासासाठी समर्पित आणि अनुभवी नेतृत्व
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flip-card h-80 w-full cursor-pointer" tabIndex={0}>
                      <div className="flip-card-inner relative w-full h-full text-center transition-transform duration-700 group-hover:rotate-y-180">
                        {/* Front */}
                        <div className="flip-card-front absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                          <div className="p-6 -mt-10">
                            <img 
                              src={member.imageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                              alt={member.designation}
                              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                            />
                            <h5 className="text-lg font-semibold text-gray-900 mb-2">{member.name || '---------'}</h5>
                            <p className="text-blue-600 font-medium">{member.designation}</p>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="flip-card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-6 rotate-y-180">
                          <h5 className="text-xl font-semibold mb-4">संपर्क माहिती</h5>
                          <p className="flex items-center text-lg">
                            <Phone className="h-5 w-5 mr-2" />
                            {member.phone || '+91 XXXXX-XXXXX'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Default team members when no data is available
                <>
                  {/* Sarpanch */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="group"
                  >
                    <div className="flip-card h-80 w-full cursor-pointer" tabIndex={0}>
                      <div className="flip-card-inner relative w-full h-full text-center transition-transform duration-700 group-hover:rotate-y-180">
                        {/* Front */}
                        <div className="flip-card-front absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                          <div className="p-6 -mt-10">
                            <img 
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                              alt="सरपंच"
                              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                            />
                            <h5 className="text-lg font-semibold text-gray-900 mb-2">---------</h5>
                            <p className="text-blue-600 font-medium">सरपंच</p>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="flip-card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-6 rotate-y-180">
                          <h5 className="text-xl font-semibold mb-4">संपर्क माहिती</h5>
                          <p className="flex items-center text-lg">
                            <Phone className="h-5 w-5 mr-2" />
                            +91 XXXXX-XXXXX
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

              {/* Up-Sarpanch */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group"
              >
                <div className="flip-card h-80 w-full cursor-pointer" tabIndex={0}>
                  <div className="flip-card-inner relative w-full h-full text-center transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="h-20 bg-gradient-to-r from-green-600 to-teal-600"></div>
                      <div className="p-6 -mt-10">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                          alt="उपसरपंच"
                          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                        />
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">---------</h5>
                        <p className="text-green-600 font-medium">उपसरपंच</p>
                      </div>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-6 rotate-y-180">
                      <h5 className="text-xl font-semibold mb-4">संपर्क माहिती</h5>
                      <p className="flex items-center text-lg">
                        <Phone className="h-5 w-5 mr-2" />
                        +91 XXXXX-XXXXX
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Gramsevak */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group"
              >
                <div className="flip-card h-80 w-full cursor-pointer" tabIndex={0}>
                  <div className="flip-card-inner relative w-full h-full text-center transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="h-20 bg-gradient-to-r from-orange-600 to-red-600"></div>
                      <div className="p-6 -mt-10">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                          alt="ग्रामसेवक"
                          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                        />
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">---------</h5>
                        <p className="text-orange-600 font-medium">ग्रामसेवक</p>
                      </div>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-6 rotate-y-180">
                      <h5 className="text-xl font-semibold mb-4">संपर्क माहिती</h5>
                      <p className="flex items-center text-lg">
                        <Phone className="h-5 w-5 mr-2" />
                        +91 XXXXX-XXXXX
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
                </>
              )}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button 
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                अधिक पहा...
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 text-center">
                  <h3 className="text-2xl font-semibold">आम्हाला संदेश पाठवा</h3>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-900 font-semibold">
                        पूर्ण नाव <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="तुमचं पूर्ण नाव"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mobile" className="text-gray-900 font-semibold">
                        मोबाइल नंबर <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mobile"
                        placeholder="तुमचा मोबाइल नंबर"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-gray-900 font-semibold">
                        संदेश <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="तुमचा संदेश येथे लिहा..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      संदेश पाठवा
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full overflow-hidden shadow-2xl">
                <div className="h-96 relative">
                  {mapSettings?.embedUrl ? (
                    <>
                      <iframe 
                        src={convertToEmbedUrl(mapSettings.embedUrl, mapSettings.latitude, mapSettings.longitude)}
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      {(mapSettings.latitude && mapSettings.longitude) && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                          <div className="text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">स्थान:</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              अक्षांश: {mapSettings.latitude}°<br/>
                              रेखांश: {mapSettings.longitude}°
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">नकाशा सेटिंग्स उपलब्ध नाहीत</p>
                        <p className="text-sm text-gray-500 mt-2">कृपया व्यवस्थापक पॅनेलमध्ये नकाशा सेटिंग्स जोडा</p>
                        <div className="mt-4 text-xs text-gray-400">
                          Debug: mapSettings = {JSON.stringify(mapSettings)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
