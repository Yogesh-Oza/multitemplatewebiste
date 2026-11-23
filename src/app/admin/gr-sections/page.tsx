'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BarChart3,
  Briefcase,
  Camera,
  ClipboardList,
  DollarSign,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Home,
  Info,
  Leaf,
  Megaphone,
  MessageSquare,
  Phone,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshStatusBadge, sectionCardTone } from '@/components/admin/gr-sections/status-badge';
import type { RefreshStatus } from '@/lib/gr-sections';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Info,
  FolderOpen,
  Award,
  Megaphone,
  Wrench,
  DollarSign,
  FileText,
  History,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Leaf,
  Camera,
  Phone,
  BarChart3,
};

interface SectionSummary {
  id: string;
  number: number;
  titleMr: string;
  titleEn: string;
  icon: string;
  comingSoon: boolean;
  filled: number;
  total: number;
  worstStatus: RefreshStatus;
}

export default function GrSectionsPage() {
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/gr-sections/tracker');
        if (res.ok) {
          const data = await res.json();
          setSections(data.sections || []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="h-7 w-7 text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-900">माहिती भरा (शासन निर्णयानुसार)</h1>
        </div>
        <p className="text-gray-600">
          विभाग निवडा → उप-विभाग उघडा → फॉर्म भरा. प्रत्येक उप-विभागाला अद्ययावत करण्याचा कालावधी (डिफॉल्ट ३० दिवस)
          आहे.
        </p>
      </div>

      {isLoading ? (
        <p>लोड होत आहे...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = ICONS[section.icon] || FileText;
            const card = (
              <Card
                key={section.id}
                className={`transition-shadow ${sectionCardTone(section.worstStatus, section.comingSoon)} ${
                  section.comingSoon ? 'cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center text-sm font-bold text-blue-700">
                        {section.number}
                      </div>
                      <div>
                        <CardTitle className="text-base leading-snug">{section.titleMr}</CardTitle>
                        <p className="text-xs text-gray-500 mt-1">{section.titleEn}</p>
                      </div>
                    </div>
                    <Icon className="h-5 w-5 text-gray-500 shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  {section.comingSoon ? (
                    <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">लवकरच</Badge>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        {section.total} पैकी {section.filled} अद्ययावत
                      </span>
                      <RefreshStatusBadge status={section.worstStatus} daysLeft={null} />
                    </>
                  )}
                </CardContent>
              </Card>
            );

            if (section.comingSoon) return card;

            return (
              <Link key={section.id} href={`/admin/gr-sections/${section.id}`}>
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
