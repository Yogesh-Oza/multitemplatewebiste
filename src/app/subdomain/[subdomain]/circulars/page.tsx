import CircularsSection from '@/components/sections/circulars-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function CircularsPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const sd = await prisma.subdomain.findUnique({ where: { subdomain } });
  if (!sd?.isActive) {
    redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">परिपत्रके</h1>
          <p className="text-lg mt-2 opacity-90">Circulars & orders</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CircularsSection />
        </div>
      </section>
    </div>
  );
}
