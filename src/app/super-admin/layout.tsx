import { Providers } from '@/components/providers/session-provider';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen">
        {children}
      </div>
    </Providers>
  );
}
