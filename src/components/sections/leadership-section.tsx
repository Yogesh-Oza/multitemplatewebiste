'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Shield, 
  Users, 
  Phone, 
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface LeadershipData {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  photo?: string;
  level: 'CM' | 'Minister' | 'Local';
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
}

interface LeadershipSectionProps {
  leadership?: LeadershipData[];
}

export function LeadershipSection({ leadership = [] }: LeadershipSectionProps) {
  const { t, language } = useTranslation();

  // Group leadership by level
  const groupedLeadership = leadership.reduce((acc, leader) => {
    if (!acc[leader.level]) {
      acc[leader.level] = [];
    }
    acc[leader.level].push(leader);
    return acc;
  }, {} as Record<string, LeadershipData[]>);

  const getLevelTitle = (level: string) => {
    switch (level) {
      case 'CM':
        return language === 'en' ? 'Chief Minister' : 'मुख्यमंत्री';
      case 'Minister':
        return language === 'en' ? 'Ministers' : 'मंत्री';
      case 'Local':
        return language === 'en' ? 'Local Officials' : 'स्थानिक अधिकारी';
      default:
        return level;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'CM':
        return Crown;
      case 'Minister':
        return Shield;
      case 'Local':
        return Users;
      default:
        return Users;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Minister':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Local':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <section id="leadership" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.leadership.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Meet our leaders who guide our village towards progress and development'
              : 'आमच्या नेत्यांना भेटा जे आमच्या गावाला प्रगती आणि विकासाच्या दिशेने नेतात'
            }
          </p>
        </div>

        {Object.keys(groupedLeadership).length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'en' 
                ? 'Leadership information will be updated soon'
                : 'नेतृत्व माहिती लवकरच अद्यतनित केली जाईल'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedLeadership).map(([level, leaders]) => {
              const LevelIcon = getLevelIcon(level);
              const levelColor = getLevelColor(level);
              
              return (
                <div key={level} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${levelColor.split(' ')[1]}`}>
                      <LevelIcon className={`w-5 h-5 ${levelColor.split(' ')[0]}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {getLevelTitle(level)}
                    </h3>
                    <Badge className={levelColor}>
                      {leaders.length} {language === 'en' ? 'Members' : 'सदस्य'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leaders.map((leader) => (
                      <Card key={leader.id} className="hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="text-center">
                            {/* Photo */}
                            <div className="relative w-24 h-24 mx-auto mb-4">
                              {leader.photo ? (
                                <Image
                                  src={leader.photo}
                                  alt={language === 'en' ? leader.nameEn : leader.name}
                                  fill
                                  className="rounded-full object-cover border-4 border-white shadow-lg"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                  {leader.name.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Name and Designation */}
                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                              {language === 'en' ? leader.nameEn : leader.name}
                            </h4>
                            <p className="text-gray-600 font-medium mb-4">
                              {language === 'en' ? leader.designationEn : leader.designation}
                            </p>

                            {/* Contact Information */}
                            <div className="space-y-2 text-sm text-gray-600">
                              {leader.phone && (
                                <div className="flex items-center justify-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <a 
                                    href={`tel:${leader.phone}`}
                                    className="hover:text-blue-600 transition-colors"
                                  >
                                    {leader.phone}
                                  </a>
                                </div>
                              )}
                              {leader.email && (
                                <div className="flex items-center justify-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <a 
                                    href={`mailto:${leader.email}`}
                                    className="hover:text-blue-600 transition-colors truncate"
                                  >
                                    {leader.email}
                                  </a>
                                </div>
                              )}
                              {leader.address && (
                                <div className="flex items-center justify-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">
                                    {leader.address}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4 w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {language === 'en' ? 'View Details' : 'तपशील पहा'}
                            </Button>
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

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Users className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View All Leadership' : 'सर्व नेतृत्व पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}