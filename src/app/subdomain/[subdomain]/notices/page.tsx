import { CommunicationsKindSection } from '@/components/sections/communications-kind-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function NoticesPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">नोटिस</h1>
          <p className="text-lg mt-2 opacity-90">Notices</p>
        </div>
      </section>
      <CommunicationsKindSection kind="notice" titleMr="नोटिस" titleEn="Notices" />
    </div>
  );
}
