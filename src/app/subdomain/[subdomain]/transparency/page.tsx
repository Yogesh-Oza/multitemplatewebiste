import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildTransparencySummary } from '@/lib/services/transparency-summary';

const prisma = new PrismaClient();

export const metadata = {
  title: 'पारदर्शकता केंद्र',
  description: 'Transparency dashboard — projects, funds, schemes, RTI compliance',
};

export default async function TransparencyPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  const summary = await buildTransparencySummary(sd.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Transparency hub',
    about: { '@type': 'GovernmentOrganization', name: sd.villageName },
  };

  const tiles = [
    {
      title: 'प्रकल्प',
      titleEn: 'Projects',
      value: summary.totalProjects,
      href: '/projects',
    },
    {
      title: 'एकूण खर्च (अंदाज)',
      titleEn: 'Funds used (reported)',
      value: `₹${summary.totalFundsUsed.toLocaleString('mr-IN')}`,
      href: '/jama-kharch',
    },
    {
      title: 'सक्रिय योजना',
      titleEn: 'Active schemes',
      value: summary.activeSchemes,
      href: '/gov-programs',
    },
    {
      title: 'RTI प्रलंबित',
      titleEn: 'RTI pending (mandatory)',
      value: summary.pendingRtiItems,
      href: '/rti',
    },
    {
      title: 'RTI पूर्णता %',
      titleEn: 'RTI compliance',
      value: `${summary.rtiCompliancePercent}%`,
      href: '/rti',
    },
    {
      title: 'तातडीच्या सूचना',
      titleEn: 'High-priority comms',
      value: summary.openCommunicationsHighPriority,
      href: '/announcements',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-r from-cyan-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">पारदर्शकता केंद्र</h1>
          <p className="text-lg mt-2 opacity-90">Transparency dashboard</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <Link key={t.title} href={t.href}>
              <Card className="h-full transition hover:shadow-lg border-cyan-200">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-950">{t.title}</CardTitle>
                  <p className="text-xs text-gray-500">{t.titleEn}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-900">{t.value}</p>
                  <p className="text-sm text-blue-700 mt-2 underline">तपशील पहा →</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
          <Link className="text-blue-800 underline" href="/downloads">
            डाउनलोड्स
          </Link>
          <Link className="text-blue-800 underline" href="/scheme-tracking">
            योजना ट्रॅकिंग
          </Link>
          <Link className="text-blue-800 underline" href="/village-statistics">
            ग्राम सांख्यिकी
          </Link>
          <Link className="text-blue-800 underline" href="/gram-sabha">
            ग्राम सभा
          </Link>
        </div>
      </section>
    </div>
  );
}
