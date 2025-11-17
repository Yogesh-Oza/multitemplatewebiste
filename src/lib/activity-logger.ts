import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { validateSubdomain } from '@/lib/subdomain';

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface LogActivityParams {
  action: ActionType;
  model: string;
  modelId: string;
  description?: string;
  request: NextRequest;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Logs an activity asynchronously (non-blocking)
 * This function should be called after successful CRUD operations
 */
export async function logActivity({
  action,
  model,
  modelId,
  description,
  request,
  userId: providedUserId,
  userName: providedUserName,
  userEmail: providedUserEmail,
}: LogActivityParams): Promise<void> {
  // Run asynchronously without blocking the API response
  setImmediate(async () => {
    try {
      let userId = providedUserId;
      let userName = providedUserName;
      let userEmail = providedUserEmail;

      // If user info not provided, try to get from token
      if (!userId) {
        const token = await getToken({ 
          req: request as any, 
          secret: process.env.NEXTAUTH_SECRET 
        });
        
        if (token) {
          // Try to get user ID from token (it might be in 'sub' or 'id')
          userId = (token as any).id || (token as any).sub;
          userName = (token as any).name || '';
          userEmail = (token as any).email || '';
          
          // If we have email but no ID, try to find user by email
          if (!userId && userEmail) {
            const user = await prisma.adminUser.findUnique({
              where: { email: userEmail },
              select: { id: true, username: true },
            });
            if (user) {
              userId = user.id;
              userName = userName || user.username;
            }
          }
        }
      }

      if (!userId) {
        // No user info available, skip logging
        return;
      }

      // Get subdomain info from request
      const { isValid, subdomainId, subdomain: subdomainName } = await validateSubdomain(request);
      
      if (!isValid || !subdomainId) {
        // No valid subdomain, skip logging
        return;
      }

      // Get subdomain details for district/subdistrict info
      const subdomainData = await prisma.subdomain.findUnique({
        where: { id: subdomainId },
        select: {
          villageName: true,
          districtName: true,
          subDistrictName: true,
        },
      });

      // Get user details if not provided
      if (!userName || !userEmail) {
        const user = await prisma.adminUser.findUnique({
          where: { id: userId },
          select: { username: true, email: true },
        });
        if (user) {
          userName = userName || user.username;
          userEmail = userEmail || user.email;
        }
      }

      // Get IP address from request
      const ipAddress = 
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        null;

      // Generate description if not provided
      const finalDescription = description || 
        `${action} ${model}${modelId ? ` (ID: ${modelId})` : ''}`;

      // Create activity log entry
      await prisma.activityLog.create({
        data: {
          action,
          model,
          modelId,
          userId,
          userName: userName || 'Unknown',
          userEmail: userEmail || 'unknown@example.com',
          subdomainId,
          subdomainName: subdomainName || undefined,
          villageName: subdomainData?.villageName || undefined,
          districtName: subdomainData?.districtName || undefined,
          subDistrictName: subdomainData?.subDistrictName || undefined,
          description: finalDescription,
          ipAddress: ipAddress || undefined,
        },
      });
    } catch (error) {
      // Log error but don't throw - we don't want to break the API call
      console.error('Error logging activity:', error);
    }
  });
}

