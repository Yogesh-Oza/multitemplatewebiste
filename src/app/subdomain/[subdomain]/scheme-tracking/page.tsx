import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Scheme tracking',
  description: 'Physical and financial progress of projects',
};

export default async function SchemeTrackingPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  const projects = await prisma.project.findMany({
    where: { subdomainId: sd.id, isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <section className="bg-gradient-to-r from-sky-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">योजना ट्रॅकिंग</h1>
          <p className="text-lg mt-2 opacity-90">Scheme and project progress</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 grid gap-6 md:grid-cols-2">
        {projects.length === 0 ? (
          <p className="md:col-span-2 text-center text-gray-600 py-12">No projects to display.</p>
        ) : (
          projects.map((p) => (
            <Card key={p.id} className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-950">{p.title}</CardTitle>
                <p className="text-sm text-gray-600">{p.titleEn}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Physical progress</span>
                    <span>{p.physicalProgress != null ? `${p.physicalProgress}%` : '—'}</span>
                  </div>
                  {p.physicalProgress != null && <Progress value={Math.min(100, p.physicalProgress)} />}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Financial progress</span>
                    <span>{p.financialProgress != null ? `${p.financialProgress}%` : '—'}</span>
                  </div>
                  {p.financialProgress != null && (
                    <Progress value={Math.min(100, p.financialProgress)} className="bg-emerald-100" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>Start: {new Date(p.startDate).toLocaleDateString('mr-IN')}</div>
                  <div>End: {p.endDate ? new Date(p.endDate).toLocaleDateString('mr-IN') : '—'}</div>
                  {p.budget != null && (
                    <div className="col-span-2">Budget: Rs.{p.budget.toLocaleString('mr-IN')}</div>
                  )}
                  {p.amountSpent != null && (
                    <div className="col-span-2">Spent: Rs.{p.amountSpent.toLocaleString('mr-IN')}</div>
                  )}
                </div>
                {(p.delayReason || p.delayReasonEn) && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-950">
                    <span className="font-medium">Delay:</span> {p.delayReason}
                    {p.delayReasonEn ? <p className="text-xs mt-1 text-amber-900">{p.delayReasonEn}</p> : null}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <div className="pb-12 text-center">
        <Link href="/projects" className="text-blue-700 underline">
          View all projects
        </Link>
      </div>
    </div>
  );
}
