/**
 * One-time copy of legacy Announcement + Circular rows into CommunicationPost.
 * Safe to re-run: skips if any communication_posts already exist (clear collection first to force re-run).
 *
 * Usage: node scripts/migrate-communications.cjs
 */
const { PrismaClient, CommunicationKind, CommunicationPriority } = require('@prisma/client');

const prisma = new PrismaClient();

function mapPri(p) {
  if (p === 'high' || p === 'low' || p === 'medium') return p;
  return CommunicationPriority.medium;
}

async function main() {
  const existing = await prisma.communicationPost.count();
  if (existing > 0) {
    console.log(`Skipping: ${existing} communication_posts already exist.`);
    return;
  }

  const announcements = await prisma.announcement.findMany({
    where: { subdomainId: { not: null } },
  });
  for (const a of announcements) {
    if (!a.subdomainId) continue;
    await prisma.communicationPost.create({
      data: {
        subdomainId: a.subdomainId,
        kind: CommunicationKind.announcement,
        title: a.title,
        titleEn: a.title,
        content: a.description,
        contentEn: '',
        image: a.image,
        legacyDate: a.date,
        priority: mapPri(a.priority),
        status: a.status,
        category: a.category,
        fullDescription: a.fullDescription ?? null,
        publishAt: a.createdAt,
        expireAt: null,
        isActive: a.isActive,
        order: a.order,
      },
    });
  }
  console.log(`Migrated ${announcements.length} announcements.`);

  const circulars = await prisma.circular.findMany({
    where: { subdomainId: { not: null } },
  });
  for (const c of circulars) {
    if (!c.subdomainId) continue;
    await prisma.communicationPost.create({
      data: {
        subdomainId: c.subdomainId,
        kind: CommunicationKind.circular,
        title: c.title,
        titleEn: c.titleEn,
        content: c.content || c.description,
        contentEn: c.contentEn || c.descriptionEn || '',
        circularType: c.type,
        department: c.department,
        departmentEn: c.departmentEn,
        referenceNumber: c.number,
        legacyDate: c.date,
        priority: mapPri(c.priority),
        status: c.status,
        attachments: c.attachments ?? [],
        issuedBy: c.issuedBy,
        issuedByEn: c.issuedByEn,
        lastUpdated: c.lastUpdated,
        publishAt: c.createdAt,
        expireAt: null,
        isActive: c.isActive,
        order: c.order,
      },
    });
  }
  console.log(`Migrated ${circulars.length} circulars.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
