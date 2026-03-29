import { CommunicationPost } from '@prisma/client';

/** Shape expected by admin homepage announcements-section */
export function communicationPostToAdminAnnouncement(p: CommunicationPost) {
  return {
    id: p.id,
    title: p.title,
    date: p.legacyDate || p.createdAt.toISOString().slice(0, 10),
    description: p.content,
    fullDescription: p.fullDescription ?? undefined,
    image: p.image ?? '',
    category: p.category || 'सामान्य',
    priority: p.priority,
    status: p.status || 'active',
    order: p.order,
    publishAt: p.publishAt?.toISOString(),
    expireAt: p.expireAt?.toISOString(),
  };
}
