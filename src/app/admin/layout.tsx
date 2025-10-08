import { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers/session-provider';

export const metadata: Metadata = {
  title: 'प्रशासन पैनल - ग्रामपंचायत',
  description: 'ग्रामपंचायत वेबसाइट प्रशासन पैनल',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 ml-80">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors />
      </div>
    </Providers>
  );
}
