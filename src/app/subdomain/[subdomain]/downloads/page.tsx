import DownloadSection from '@/components/sections/download-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function DownloadsPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">डाउनलोड्स / कागदपत्रे</h1>
          <p className="text-lg mt-2 opacity-90">Downloads & documents</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <DownloadSection />
        </div>
      </section>
    </div>
  );
}
