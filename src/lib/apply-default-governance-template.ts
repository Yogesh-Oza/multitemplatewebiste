import path from 'path';
import type { PrismaClient, Subdomain } from '@prisma/client';

type SubdomainSeedShape = Pick<Subdomain, 'id' | 'subdomain' | 'phone' | 'email' | 'address'>;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const governanceSeed = require(path.join(
  process.cwd(),
  'scripts',
  'governance-default-seed.cjs'
)) as {
  applyDefaultGovernanceTemplate: (prisma: PrismaClient, s: SubdomainSeedShape) => Promise<void>;
};

/**
 * Applies the shared default governance + demo template to one subdomain (idempotent).
 * Each village gets its own DB rows; village admins can replace content in the admin panel.
 */
export async function applyDefaultGovernanceTemplateToSubdomain(
  prismaClient: PrismaClient,
  subdomain: SubdomainSeedShape
): Promise<void> {
  await governanceSeed.applyDefaultGovernanceTemplate(prismaClient, subdomain);
}
