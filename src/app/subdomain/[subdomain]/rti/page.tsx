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

function pdfFileNameFromUrl(url: string): string {
  try {
    const pathOnly = url.startsWith('http') ? new URL(url).pathname : url;
    const seg = pathOnly.split('/').filter(Boolean).pop();
    return seg && seg.endsWith('.pdf') ? seg : 'document.pdf';
  } catch {
    return 'document.pdf';
  }
}

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
              अनिवार्य पूर्णता: {completed}/{mandatory} ({pct}%) · Mandatory completion: {completed}/{mandatory} ({pct}%)
            </p>
          )}
        </div>
      </section>

      <section className="py-10 container mx-auto px-4 max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>कार्यालय / PIO · Office / PIO</CardTitle>
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
                  <strong>शुल्क / Fees:</strong> {profile.feesMr || profile.feesEn}
                </p>
                <p>
                  <strong>वेळ / Hours:</strong> {profile.hoursMr || profile.hoursEn}
                </p>
                <p>
                  <strong>संपर्क / Contact:</strong> {profile.contactPhone} {profile.contactEmail}
                </p>
                <p className="whitespace-pre-wrap">{profile.addressMr}</p>
                {profile.firstAppealMr ? (
                  <p className="pt-2 border-t text-gray-700 whitespace-pre-wrap">{profile.firstAppealMr}</p>
                ) : null}
              </>
            ) : (
              <p className="text-gray-600">
                कार्यालय प्रोफाइल अद्याप भरलेले नाही. · Office profile pending admin entry.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-5 text-center border-b border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-[rgb(0,8,169)]">अर्ज नमुने</h2>
            <p className="text-xs text-slate-600 mt-1">Application form samples (PDF only)</p>
          </div>
          <div className="p-4 overflow-x-auto">
            {forms.length === 0 ? (
              <p className="text-center text-gray-600 py-8 text-sm">
                अर्ज नमुने अद्याप जोडलेले नाहीत. ग्रामपंचायत प्रशासक RTI प्रशासनातून PDF जोडू शकतात.
                <br />
                <span className="text-gray-500">No sample forms yet. Village admin can add PDFs from Admin → RTI.</span>
              </p>
            ) : (
              <table className="w-full text-sm border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="border border-slate-300 px-3 py-3 text-left font-semibold text-base">
                      शीर्षक · Title
                    </th>
                    <th className="border border-slate-300 px-3 py-3 text-left font-semibold text-base w-[280px]">
                      नमुना · Sample (PDF)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((f) => {
                    const fileName = pdfFileNameFromUrl(f.url);
                    return (
                      <tr key={f.id} className="odd:bg-slate-50 even:bg-white align-middle">
                        <td className="border border-slate-300 px-3 py-3 text-gray-900">
                          <span className="font-medium text-gray-900">{f.labelMr}</span>
                          {f.labelEn ? (
                            <p className="text-gray-600 text-xs mt-1 leading-snug">{f.labelEn}</p>
                          ) : null}
                        </td>
                        <td className="border border-slate-300 px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-md border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                            >
                              PDF पहा · View PDF
                            </a>
                            <a
                              href={f.url}
                              download={fileName}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-md border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50"
                            >
                              डाउनलोड · Download
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">अनिवार्य प्रकटीकरण · Mandatory disclosure</h2>
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
