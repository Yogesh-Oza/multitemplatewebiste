'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProfilePage() {
  const { data } = useSession();
  const user = data?.user as any;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">प्रोफाइल</h1>
      <Card>
        <CardHeader>
          <CardTitle>खाते माहिती</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-gray-700">Username: {user?.name || '-'}</div>
          <div className="text-sm text-gray-700">Email: {user?.email || '-'}</div>
          <div className="text-sm text-gray-700">Role: {user?.role || '-'}</div>
        </CardContent>
      </Card>
    </div>
  );
}



