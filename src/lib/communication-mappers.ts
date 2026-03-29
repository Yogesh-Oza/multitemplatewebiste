import { CommunicationPost } from '@prisma/client';

export function communicationPostToAnnouncementShape(p: CommunicationPost) {
  return {
    id: p.id,
    title: p.title,
    description: p.content,
    date: p.legacyDate || p.createdAt.toISOString().slice(0, 10),
    imageUrl: p.image || '/images/placeholder.png',
    priority: p.priority,
    status: p.status || 'active',
    category: p.category || 'सामान्य',
    fullDescription: p.fullDescription ?? undefined,
    _source: 'communication_post' as const,
  };
}

export function communicationPostToCircularShape(p: CommunicationPost) {
  return {
    id: p.id,
    title: p.title,
    titleEn: p.titleEn,
    type: (p.circularType || 'circular') as 'circular' | 'order' | 'memo' | 'notification',
    department: p.department || '',
    departmentEn: p.departmentEn || '',
    number: p.referenceNumber || '',
    date: p.legacyDate || p.createdAt.toISOString().slice(0, 10),
    priority: p.priority as 'high' | 'medium' | 'low',
    status: (p.status || 'active') as 'active' | 'superseded' | 'draft',
    description: p.content,
    descriptionEn: p.contentEn || '',
    content: p.content,
    contentEn: p.contentEn || '',
    attachments: (p.attachments as unknown[]) || [],
    issuedBy: p.issuedBy || '',
    issuedByEn: p.issuedByEn || '',
    lastUpdated: p.lastUpdated || p.updatedAt.toISOString(),
    _source: 'communication_post' as const,
  };
}
