import { AboutSection } from '@/components/sections/about-section';
import { OfficeInformationSection } from '@/components/sections/office-information-section';
import { RolesResponsibilitiesSection } from '@/components/sections/roles-responsibilities-section';
import { CompleteEmergencyContactsSection } from '@/components/sections/complete-emergency-contacts-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

interface AboutPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainAboutPage({ params }: AboutPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      officeDetails: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      roles: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      emergencyContacts: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  // Transform the data to match the expected interface
  const villageInfo = subdomainData.villageInfo?.[0] ? {
    ...subdomainData.villageInfo[0],
    stats: Array.isArray(subdomainData.villageInfo[0].stats) 
      ? subdomainData.villageInfo[0].stats as any[]
      : []
  } : null;

  // Transform office details
  const officeDetails = subdomainData.officeDetails?.[0] ? {
    address: subdomainData.officeDetails[0].address,
    addressEn: subdomainData.officeDetails[0].addressEn,
    phone: subdomainData.officeDetails[0].phone,
    email: subdomainData.officeDetails[0].email,
    workingHours: subdomainData.officeDetails[0].workingHours,
    workingHoursEn: subdomainData.officeDetails[0].workingHoursEn,
    importantNotice: subdomainData.officeDetails[0].importantNotice || undefined,
    importantNoticeEn: subdomainData.officeDetails[0].importantNoticeEn || undefined
  } : null;

  // Transform roles
  const roles = subdomainData.roles && subdomainData.roles.length > 0 ? subdomainData.roles.map(role => ({
    title: role.title,
    titleEn: role.titleEn,
    description: role.description,
    responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities as string[] : [],
    icon: role.icon,
    color: role.color
  })) : null;

  // Transform emergency contacts
  const emergencyContacts = subdomainData.emergencyContacts && subdomainData.emergencyContacts.length > 0 ? subdomainData.emergencyContacts.map(contact => ({
    id: contact.id,
    name: contact.name,
    nameEn: contact.nameEn,
    phone: contact.phone,
    description: contact.description,
    icon: contact.icon,
    color: contact.color,
    priority: contact.priority as 'high' | 'medium' | 'low',
    category: contact.category
  })) : null;

  return (
    <div className="min-h-screen">
      <div id="village-history">
        <AboutSection villageInfo={villageInfo} />
      </div>

      <div id="panchayat-structure" className="scroll-mt-28" />
      <div id="vision-mission" className="scroll-mt-28" />
      
      <div id="office-details" className="scroll-mt-28">
        <OfficeInformationSection officeDetails={officeDetails} />
      </div>
      
      <div id="roles-responsibilities" className="scroll-mt-28">
        <RolesResponsibilitiesSection roles={roles} />
      </div>
      
      <div id="emergency-contacts" className="scroll-mt-28">
        <CompleteEmergencyContactsSection emergencyContacts={emergencyContacts} />
      </div>
    </div>
  );
}
