import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

// Default leaders data for all villages
const defaultLeaders = [
  {
    id: 'cm',
    name: 'Shri. Devendra Fadnavis',
    role: 'मा. मुख्यमंत्री',
    roleEn: 'Hon\'ble Chief Minister',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241226554268834.png',
    order: 0,
    isActive: true,
  },
  {
    id: 'dcm-eknath',
    name: 'Shri. Eknath Shinde',
    role: 'मा. उपमुख्यमंत्री',
    roleEn: 'Hon\'ble Deputy Chief Minister',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241210519881483.jpeg',
    order: 1,
    isActive: true,
  },
  {
    id: 'dcm-ajit',
    name: 'Shri. Ajit Pawar',
    role: 'मा. उपमुख्यमंत्री',
    roleEn: 'Hon\'ble Deputy Chief Minister',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/09/202409281433179732.jpeg',
    order: 2,
    isActive: true,
  },
  {
    id: 'minister-rd',
    name: 'Shri. Jayakumar Gore',
    role: 'मा. मंत्री, ग्रामविकास व पंचायतराज',
    roleEn: 'Hon\'ble Minister, Rural Development & PR',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241226862517803.png',
    order: 3,
    isActive: true,
  },
  {
    id: 'mos-rd',
    name: 'Shri. Yogesh Kadam',
    role: 'मा. राज्यमंत्री, ग्रामविकास व पंचायतराज',
    roleEn: 'Hon\'ble MoS, Rural Development & PR',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/202412271839437941.png',
    order: 4,
    isActive: true,
  },
  {
    id: 'ps-rd',
    name: 'Shri. Eknath Dawale',
    role: 'प्रमुख सचिव, ग्रामविकास व पंचायतराज',
    roleEn: 'Principal Secretary, Rural Development & PR',
    imageUrl: 'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/202412261951170016.png',
    order: 5,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    let leaders = await prisma.leader.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    // If no leaders exist for this subdomain, create default leaders
    if (leaders.length === 0 && subdomainId) {
      try {
        const createdLeaders = await prisma.leader.createMany({
          data: defaultLeaders.map(leader => ({
            name: leader.name,
            role: leader.role,
            roleEn: leader.roleEn,
            imageUrl: leader.imageUrl,
            order: leader.order,
            isActive: leader.isActive,
            subdomainId: subdomainId,
          })),
        });

        // Fetch the created leaders
        leaders = await prisma.leader.findMany({
          where: { subdomainId },
          orderBy: { order: 'asc' }
        });
      } catch (error) {
        console.error('Error creating default leaders:', error);
        // If creation fails, return default leaders anyway
        return NextResponse.json(defaultLeaders);
      }
    }

    return NextResponse.json(leaders);
  } catch (error) {
    console.error('Error fetching leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, role, roleEn, imageUrl, order, isActive } = body;

    const leader = await prisma.leader.create({
      data: {
        name,
        role,
        roleEn,
        imageUrl,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Leader', leader.id, `Created leader: ${name} (${role})`);

    return NextResponse.json(leader);
  } catch (error) {
    console.error('Error creating leader:', error);
    return NextResponse.json(
      { error: 'Failed to create leader' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, name, role, roleEn, imageUrl, order, isActive } = body;

    // Verify the leader belongs to this subdomain
    const existingLeader = await prisma.leader.findFirst({
      where: { id, subdomainId }
    });

    if (!existingLeader) {
      return NextResponse.json({ 
        message: 'Leader not found or access denied' 
      }, { status: 404 });
    }

    const leader = await prisma.leader.update({
      where: { id },
      data: {
        name,
        role,
        roleEn,
        imageUrl,
        order: order !== undefined ? order : existingLeader.order,
        isActive: isActive !== undefined ? isActive : existingLeader.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Leader', leader.id, `Updated leader: ${name} (${role})`);

    return NextResponse.json(leader);
  } catch (error) {
    console.error('Error updating leader:', error);
    return NextResponse.json(
      { error: 'Failed to update leader' },
      { status: 500 }
    );
  }
}

