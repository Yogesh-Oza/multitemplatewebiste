import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Gram Sabha',
  description: 'Gram Sabha meetings and resolutions',
};

export default async function GramSabhaPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  const meetings = await prisma.gramSabhaMeeting.findMany({
    where: { subdomainId: sd.id, isActive: true },
    orderBy: { date: 'desc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Gram Sabha',
    about: { '@type': 'GovernmentOrganization', name: sd.villageName },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-r from-amber-700 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">ग्राम सभा</h1>
          <p className="text-lg mt-2 opacity-90">Official Gram Sabha record</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 space-y-8">
        {meetings.length === 0 ? (
          <p className="text-center text-gray-600 py-12">No meetings published yet.</p>
        ) : (
          meetings.map((m) => {
            const resolutions = Array.isArray(m.resolutions) ? (m.resolutions as { text?: string }[]) : [];
            const documents = Array.isArray(m.documents) ? (m.documents as { name?: string; url?: string }[]) : [];
            return (
              <Card key={m.id} className="border-amber-200 shadow-md">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-xl text-amber-950">
                    {new Date(m.date).toLocaleDateString('mr-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      उपस्थिती: {m.attendanceCount}
                    </Badge>
                    {m.quorumMet ? (
                      <Badge className="gap-1 bg-green-600">
                        <CheckCircle className="h-3 w-3" />
                        कोरम पूर्ण
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        कोरम अपूर्ण
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-800">
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">कार्यसूची</h3>
                    <p className="whitespace-pre-wrap">{m.agenda}</p>
                    {m.agendaEn ? <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{m.agendaEn}</p> : null}
                  </div>
                  {resolutions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">ठराव</h3>
                      <ul className="list-decimal pl-5 space-y-2">
                        {resolutions.map((r, i) => (
                          <li key={i}>{r.text || JSON.stringify(r)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {documents.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">दस्तऐवज</h3>
                      <ul className="space-y-1">
                        {documents.map((d, i) => (
                          <li key={i}>
                            {d.url ? (
                              <a href={d.url} className="text-blue-700 underline" target="_blank" rel="noreferrer">
                                {d.name || d.url}
                              </a>
                            ) : (
                              d.name
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
