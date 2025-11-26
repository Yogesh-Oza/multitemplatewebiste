'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResetPasswordModal from '@/components/admin/reset-password-modal';

export default function AdminProfilePage() {
  const { data } = useSession();
  const user = data?.user as any;
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">प्रोफाइल</h1>
      <Card>
        <CardHeader>
          <CardTitle>खाते माहिती</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-700">Username: {user?.name || '-'}</div>
          <div className="text-sm text-gray-700">Email: {user?.email || '-'}</div>
          <div className="text-sm text-gray-700">Role: {user?.role || '-'}</div>
          <div className="pt-4 border-t">
            <Button
              onClick={() => setShowResetPassword(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              पासवर्ड रीसेट करा
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
      />
    </div>
  );
}



