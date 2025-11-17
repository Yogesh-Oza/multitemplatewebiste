import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logActivity } from './activity-logger';

/**
 * Helper function to log activity after CRUD operations
 * This simplifies the logging code in API routes
 */
export async function logCrudActivity(
  request: NextRequest,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  model: string,
  modelId: string,
  description?: string
): Promise<void> {
  const token = await getToken({ 
    req: request as any, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  await logActivity({
    action,
    model,
    modelId,
    description,
    request,
    userId: (token as any)?.id,
    userName: (token as any)?.name,
    userEmail: (token as any)?.email,
  });
}

