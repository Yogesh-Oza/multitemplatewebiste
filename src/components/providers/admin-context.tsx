'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AdminContextType {
  isSubdomain: boolean;
  subdomain: string | null;
  subdomainId: string | null;
  villageName: string | null;
}

const AdminContext = createContext<AdminContextType>({
  isSubdomain: false,
  subdomain: null,
  subdomainId: null,
  villageName: null,
});

export function AdminContextProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AdminContextType>({
    isSubdomain: false,
    subdomain: null,
    subdomainId: null,
    villageName: null,
  });

  useEffect(() => {
    const detectSubdomain = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      // Check if this is a subdomain (not localhost or www)
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        const subdomain = parts[0];
        
        try {
          // Fetch subdomain data
          const response = await fetch(`/api/subdomain/validate?subdomain=${subdomain}`);
          const data = await response.json();
          
          if (data.valid && data.subdomain) {
            setContext({
              isSubdomain: true,
              subdomain,
              subdomainId: data.subdomain.id,
              villageName: data.subdomain.villageName,
            });
          }
        } catch (error) {
          console.error('Error detecting subdomain:', error);
        }
      }
    };

    detectSubdomain();
  }, []);

  return (
    <AdminContext.Provider value={context}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminContextProvider');
  }
  return context;
}
