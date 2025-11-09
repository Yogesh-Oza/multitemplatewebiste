import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

// Default daily messages
const defaultMessages = [
  {
    message: 'एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव बनवण्यासाठी सर्व नागरिकांचा सहभाग आवश्यक आहे.',
    authorTitle: 'सरपंच',
    date: new Date().toLocaleDateString('mr-IN'),
    category: 'governance',
    icon: 'User',
    color: 'from-blue-500 to-indigo-600',
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

    let messages = await prisma.dailyMessage.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // If no messages exist, create default one
    if (messages.length === 0 && subdomainId) {
      try {
        const defaultMessage = await prisma.dailyMessage.create({
          data: {
            ...defaultMessages[0],
            date: new Date().toLocaleDateString('mr-IN'),
            subdomainId: subdomainId,
          },
        });
        messages = [defaultMessage];
      } catch (error) {
        console.error('Error creating default message:', error);
        return NextResponse.json(defaultMessages[0]);
      }
    }

    // Return the most recent active message
    return NextResponse.json(messages[0] || null);
  } catch (error) {
    console.error('Error fetching daily message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily message' },
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
    const { message, authorTitle, date, category, icon, color, isActive } = body;

    // Deactivate all existing messages for this subdomain
    await prisma.dailyMessage.updateMany({
      where: { subdomainId },
      data: { isActive: false }
    });

    const dailyMessage = await prisma.dailyMessage.create({
      data: {
        message,
        authorTitle,
        date: date || new Date().toLocaleDateString('mr-IN'),
        category,
        icon,
        color,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    return NextResponse.json(dailyMessage);
  } catch (error) {
    console.error('Error creating daily message:', error);
    return NextResponse.json(
      { error: 'Failed to create daily message' },
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
    const { id, message, authorTitle, date, category, icon, color, isActive } = body;

    const existingMessage = await prisma.dailyMessage.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMessage) {
      return NextResponse.json({ 
        message: 'Daily message not found or access denied' 
      }, { status: 404 });
    }

    // If activating this message, deactivate others
    if (isActive && !existingMessage.isActive) {
      await prisma.dailyMessage.updateMany({
        where: { subdomainId, id: { not: id } },
        data: { isActive: false }
      });
    }

    const dailyMessage = await prisma.dailyMessage.update({
      where: { id },
      data: {
        message,
        authorTitle,
        date: date || existingMessage.date,
        category,
        icon,
        color,
        isActive: isActive !== undefined ? isActive : existingMessage.isActive,
      },
    });

    return NextResponse.json(dailyMessage);
  } catch (error) {
    console.error('Error updating daily message:', error);
    return NextResponse.json(
      { error: 'Failed to update daily message' },
      { status: 500 }
    );
  }
}

