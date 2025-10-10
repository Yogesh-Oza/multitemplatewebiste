'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubdomainValidatorProps {
  subdomain: string;
  children: React.ReactNode;
}

export function SubdomainValidator({ subdomain, children }: SubdomainValidatorProps) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSubdomain = async () => {
      try {
        const response = await fetch(`/api/subdomain/validate?subdomain=${subdomain}`);
        const data = await response.json();
        
        if (!data.valid) {
          // Redirect to main site for invalid subdomains
          console.log('Invalid subdomain, redirecting to main site');
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          window.location.replace(baseUrl);
          return;
        }
        
        setIsValidating(false);
      } catch (error) {
        console.error('Error validating subdomain:', error);
        // On error, redirect to main site
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        window.location.replace(baseUrl);
      }
    };

    validateSubdomain();
  }, [subdomain]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating subdomain...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
