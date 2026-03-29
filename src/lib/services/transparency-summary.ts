import { prisma } from '@/lib/prisma';
import { RtiComplianceStatus } from '@prisma/client';

export type TransparencySummary = {
  totalProjects: number;
  totalFundsUsed: number;
  activeSchemes: number;
  pendingRtiItems: number;
  totalRtiMandatory: number;
  rtiCompliancePercent: number;
  openCommunicationsHighPriority: number;
};

export async function buildTransparencySummary(subdomainId: string): Promise<TransparencySummary> {
  const [
    totalProjects,
    fundsAgg,
    activeSchemes,
    pendingRti,
    totalMandatory,
    completedMandatory,
    highPriComms,
  ] = await Promise.all([
    prisma.project.count({ where: { subdomainId, isActive: true } }),
    prisma.project.aggregate({
      where: { subdomainId, isActive: true },
      _sum: { amountSpent: true },
    }),
    prisma.governmentScheme.count({ where: { subdomainId, isActive: true } }),
    prisma.rtiMandatoryDisclosureItem.count({
      where: {
        subdomainId,
        isActive: true,
        isMandatory: true,
        complianceStatus: RtiComplianceStatus.pending,
      },
    }),
    prisma.rtiMandatoryDisclosureItem.count({
      where: { subdomainId, isActive: true, isMandatory: true },
    }),
    prisma.rtiMandatoryDisclosureItem.count({
      where: {
        subdomainId,
        isActive: true,
        isMandatory: true,
        complianceStatus: RtiComplianceStatus.completed,
      },
    }),
    prisma.communicationPost.count({
      where: {
        subdomainId,
        isActive: true,
        priority: 'high',
        OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
        AND: [{ OR: [{ expireAt: null }, { expireAt: { gt: new Date() } }] }],
      },
    }),
  ]);

  const totalFundsUsed = fundsAgg._sum.amountSpent ?? 0;
  const rtiCompliancePercent =
    totalMandatory === 0 ? 100 : Math.round((completedMandatory / totalMandatory) * 100);

  return {
    totalProjects,
    totalFundsUsed,
    activeSchemes,
    pendingRtiItems: pendingRti,
    totalRtiMandatory: totalMandatory,
    rtiCompliancePercent,
    openCommunicationsHighPriority: highPriComms,
  };
}
