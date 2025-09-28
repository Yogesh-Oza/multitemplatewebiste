import { Metadata } from 'next';
import { VillageInfoForm } from '@/components/admin/village-info-form';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'गाव माहिती - प्रशासन पैनल',
  description: 'गाव माहिती व्यवस्थापन',
};

export default async function VillageInfoPage() {
  const villageInfo = await prisma.villageInfo.findFirst();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">गाव माहिती</h1>
        <p className="text-gray-600 mt-2">गावाची मुख्य माहिती आणि आकडेवारी व्यवस्थापन</p>
      </div>
      
      <VillageInfoForm initialData={villageInfo} />
    </div>
  );
}
