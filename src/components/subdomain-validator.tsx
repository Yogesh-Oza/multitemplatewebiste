'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubdomainValidatorProps {
  subdomain: string;
  children: React.ReactNode;
}

export function SubdomainValidator({ subdomain, children }: SubdomainValidatorProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateSubdomain = async () => {
      try {
        const response = await fetch(`/api/subdomain/validate?subdomain=${subdomain}`);
        if (response.ok) {
          const data = await response.json();
          setIsValid(data.valid);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Error validating subdomain:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (subdomain) {
      validateSubdomain();
    }
  }, [subdomain]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">तपासत आहे...</p>
          <p className="text-sm text-gray-500">Validating subdomain...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ग्रामपंचायत सापडली नाही
          </h1>
          <p className="text-gray-600 mb-4">
            Gram Panchayat not found
          </p>
          <p className="text-sm text-gray-500 mb-6">
            "{subdomain}" या नावाची ग्रामपंचायत सापडली नाही. कृपया योग्य URL तपासा.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            मुख्य पृष्ठावर जा
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}