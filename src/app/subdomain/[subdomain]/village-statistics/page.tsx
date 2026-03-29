import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { VillageStatsChart } from '@/components/sections/village-stats-chart';

const prisma = new PrismaClient();

export const metadata = {
  title: 'ग्राम सांख्यिकी',
  description: 'Year-wise village statistics',
};

export default async function VillageStatisticsPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  const y = new Date().getFullYear();
  const years = [y, y - 1, y - 2];
  const rows = await prisma.villageStatistics.findMany({
    where: { subdomainId: sd.id, year: { in: years } },
    orderBy: { year: 'asc' },
  });

  const chartData = rows.map((r) => ({
    year: String(r.year),
    लोकसंख्या: r.population,
    मतदार: r.voters,
  }));

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: sd.villageName,
    alternateName: sd.villageNameEn,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <section className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">ग्राम सांख्यिकी</h1>
          <p className="text-lg mt-2 opacity-90">Village statistics (year-wise)</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        {rows.length === 0 ? (
          <p className="text-center text-gray-600 py-12">
            अद्याप सांख्यिकी नोंदणी केलेली नाही. / No statistics published yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm mb-10">
              <table className="min-w-full text-sm">
                <thead className="bg-emerald-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">वर्ष</th>
                    <th className="px-4 py-3 text-right">लोकसंख्या</th>
                    <th className="px-4 py-3 text-right">मतदार</th>
                    <th className="px-4 py-3 text-right">वॉर्ड</th>
                    <th className="px-4 py-3 text-right">शाळा</th>
                    <th className="px-4 py-3 text-right">अंगणवाड्या</th>
                    <th className="px-4 py-3 text-left">स्त्रोत</th>
                  </tr>
                </thead>
                <tbody>
                  {rows
                    .slice()
                    .sort((a, b) => b.year - a.year)
                    .map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{r.year}</td>
                        <td className="px-4 py-3 text-right">{r.population}</td>
                        <td className="px-4 py-3 text-right">{r.voters}</td>
                        <td className="px-4 py-3 text-right">{r.wards}</td>
                        <td className="px-4 py-3 text-right">{r.schools ?? '—'}</td>
                        <td className="px-4 py-3 text-right">{r.anganwadis ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{r.sourceMr || r.sourceEn || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {chartData.length > 0 && <VillageStatsChart data={chartData} />}
          </>
        )}
      </section>
    </div>
  );
}
