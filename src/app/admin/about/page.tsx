'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Phone, Users } from 'lucide-react';
import { OfficeDetailsAdmin } from '@/components/admin/about/office-details-admin';
import { RolesAdmin } from '@/components/admin/about/roles-admin';
import { EmergencyContactsAdmin } from '@/components/admin/about/emergency-contacts-admin';

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState('office');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ग्रामपंचायतीबद्दल व्यवस्थापन</h1>
        <p className="text-gray-600 mt-2">कार्यालय माहिती, भूमिका आणि आपत्कालीन संपर्क व्यवस्थापन</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="office">
            <Building className="h-4 w-4 mr-2" />
            कार्यालय माहिती
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            भूमिका व जबाबदाऱ्या
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Phone className="h-4 w-4 mr-2" />
            आपत्कालीन संपर्क
          </TabsTrigger>
        </TabsList>

        <TabsContent value="office" className="mt-6">
          <OfficeDetailsAdmin />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <RolesAdmin />
        </TabsContent>
        <TabsContent value="contacts" className="mt-6">
          <EmergencyContactsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
