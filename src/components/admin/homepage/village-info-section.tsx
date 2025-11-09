'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { VillageInfoForm } from '@/components/admin/village-info-form';

export function VillageInfoSection() {
  return (
    <Accordion type="single" collapsible defaultValue="village-info" className="w-full">
      <AccordionItem value="village-info">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Home className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">गाव माहिती</h2>
                <p className="text-sm text-gray-600">गावाची मुख्य माहिती आणि आकडेवारी व्यवस्थापन</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-4">
            <VillageInfoForm />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

