'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, User } from 'lucide-react';
import Image from 'next/image';

interface Leadership {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  photo: string | null;
  level: string;
  order: number;
}

interface LeadershipSectionProps {
  leadership?: Leadership[];
}

export function LeadershipSection({ leadership = [] }: LeadershipSectionProps) {
  const { t, language } = useTranslation();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'CM':
        return Crown;
      case 'Minister':
        return Users;
      default:
        return User;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Minister':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const groupedLeadership = leadership.reduce((acc, leader) => {
    if (!acc[leader.level]) {
      acc[leader.level] = [];
    }
    acc[leader.level].push(leader);
    return acc;
  }, {} as Record<string, Leadership[]>);

  const levelOrder = ['CM', 'Minister', 'Local'];

  return (
    <section id="leadership" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('leadership.title')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-12">
          {levelOrder.map((level) => {
            const leaders = groupedLeadership[level];
            if (!leaders || leaders.length === 0) return null;

            const LevelIcon = getLevelIcon(level);
            const levelLabel = language === 'en' 
              ? (level === 'CM' ? t('leadership.cm') : level === 'Minister' ? t('leadership.ministers') : t('leadership.localOfficials'))
              : (level === 'CM' ? t('leadership.cm') : level === 'Minister' ? t('leadership.ministers') : t('leadership.localOfficials'));

            return (
              <div key={level}>
                <div className="flex items-center mb-6">
                  <LevelIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {levelLabel}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leaders
                    .sort((a, b) => a.order - b.order)
                    .map((leader) => (
                      <Card key={leader.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6 text-center">
                          <div className="relative mb-4">
                            {leader.photo ? (
                              <Image
                                src={leader.photo}
                                alt={language === 'en' ? leader.nameEn : leader.name}
                                width={120}
                                height={120}
                                className="w-30 h-30 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-30 h-30 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            <Badge 
                              className={`absolute -top-2 -right-2 ${getLevelColor(leader.level)}`}
                            >
                              {leader.level}
                            </Badge>
                          </div>
                          
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {language === 'en' ? leader.nameEn : leader.name}
                          </h4>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {language === 'en' ? leader.designationEn : leader.designation}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Organizational Hierarchy */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {language === 'en' ? 'Organizational Hierarchy' : 'संस्थात्मक पदानुक्रम'}
          </h3>
          
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                {/* CM Level */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {t('leadership.cm')}
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-0.5 h-8 bg-gray-300"></div>

                {/* Ministers Level */}
                <div className="flex space-x-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {t('leadership.ministers')}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-0.5 h-8 bg-gray-300"></div>

                {/* Local Officials Level */}
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {t('leadership.sarpanch')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {t('leadership.upSarpanch')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {t('leadership.gramsevak')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}