import { PrismaClient, RtiComplianceStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const prisma = new PrismaClient();

export const metadata = {
  title: 'RTI',
  description: 'Right to Information disclosures',
};

export default async function RtiPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  const [profile, disclosures, forms] = await Promise.all([
    prisma.rtiOfficeProfile.findUnique({ where: { subdomainId: sd.id } }),
    prisma.rtiMandatoryDisclosureItem.findMany({
      where: { subdomainId: sd.id, isActive: true },
      orderBy: [{ order: 'asc' }, { clauseKey: 'asc' }],
    }),
    prisma.rtiFormLink.findMany({
      where: { subdomainId: sd.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  const completed = disclosures.filter(
    (d) => d.isMandatory && d.complianceStatus === RtiComplianceStatus.completed
  ).length;
  const mandatory = disclosures.filter((d) => d.isMandatory).length;
  const pct = mandatory === 0 ? 100 : Math.round((completed / mandatory) * 100);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RTI Information',
    publisher: { '@type': 'GovernmentOrganization', name: sd.villageName },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-r from-slate-800 to-zinc-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">माहितीचा अधिकार (RTI)</h1>
          <p className="text-lg mt-2 opacity-90">Right to Information</p>
          {mandatory > 0 && (
            <p className="mt-4 text-sm opacity-90">
              Mandatory completion: {completed}/{mandatory} ({pct}%)
            </p>
          )}
        </div>
      </section>

      <section className="py-10 container mx-auto px-4 max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>कार्यालय / PIO</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-800 space-y-2">
            {profile ? (
              <>
                <p>
                  <strong>PIO:</strong> {profile.pioName} ({profile.pioDesignation})
                </p>
                <p>
                  <strong>APIO:</strong> {profile.apioName}
                </p>
                <p>
                  <strong>Fees:</strong> {profile.feesMr || profile.feesEn}
                </p>
                <p>
                  <strong>Hours:</strong> {profile.hoursMr || profile.hoursEn}
                </p>
                <p>
                  <strong>Contact:</strong> {profile.contactPhone} {profile.contactEmail}
                </p>
                <p className="whitespace-pre-wrap">{profile.addressMr}</p>
                {profile.firstAppealMr ? (
                  <p className="pt-2 border-t text-gray-700 whitespace-pre-wrap">{profile.firstAppealMr}</p>
                ) : null}
              </>
            ) : (
              <p className="text-gray-600">Office profile pending admin entry.</p>
            )}
          </CardContent>
        </Card>

        {forms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Form links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {forms.map((f) => (
                <a
                  key={f.id}
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
                >
                  {f.labelMr}
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mandatory disclosure</h2>
          {disclosures.length === 0 ? (
            <p className="text-gray-600">No disclosure rows yet. Admin can seed defaults via API.</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {disclosures.map((d) => (
                <AccordionItem key={d.id} value={d.id}>
                  <AccordionTrigger className="text-left">
                    <span className="flex flex-wrap items-center gap-2">
                      {d.titleMr}
                      {d.isMandatory ? (
                        <Badge variant="secondary">Mandatory</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                      <Badge
                        className={
                          d.complianceStatus === RtiComplianceStatus.completed
                            ? 'bg-green-600'
                            : 'bg-amber-600'
                        }
                      >
                        {d.complianceStatus === RtiComplianceStatus.completed ? 'Done' : 'Pending'}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 space-y-3">
                    <p className="font-medium text-gray-900">{d.titleEn}</p>
                    {d.contentMr ? <p className="whitespace-pre-wrap">{d.contentMr}</p> : null}
                    {d.contentEn ? <p className="whitespace-pre-wrap text-gray-600">{d.contentEn}</p> : null}
                    {d.documentUrl ? (
                      <a href={d.documentUrl} className="text-blue-700 underline" target="_blank" rel="noreferrer">
                        View document
                      </a>
                    ) : null}
                    {d.lastVerifiedAt && (
                      <p className="text-xs text-gray-500">
                        Last verified: {new Date(d.lastVerifiedAt).toLocaleString('mr-IN')}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
}
