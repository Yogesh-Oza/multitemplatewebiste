import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

// Demo data for emergency contacts
const getDemoEmergencyContacts = () => [
  {
    id: 'demo-1',
    name: 'पोलीस',
    nameEn: 'Police',
    phone: '100 / +91 12345 11111',
    description: 'आपत्कालीन प्रसंगी त्वरित सहाय्य',
    icon: 'Shield',
    color: 'from-blue-500 to-indigo-600',
    priority: 'high',
    category: 'सुरक्षा',
    order: 0,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'रुग्णवाहिका',
    nameEn: 'Ambulance',
    phone: '108 / +91 12345 22222',
    description: 'आरोग्य आपत्कालीन सेवा',
    icon: 'Stethoscope',
    color: 'from-red-500 to-pink-600',
    priority: 'high',
    category: 'आरोग्य',
    order: 1,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-3',
    name: 'अग्निशमन',
    nameEn: 'Fire Department',
    phone: '101 / +91 12345 33333',
    description: 'अग्निशमन आणि बचाव सेवा',
    icon: 'Flame',
    color: 'from-orange-500 to-red-600',
    priority: 'high',
    category: 'सुरक्षा',
    order: 2,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-4',
    name: 'आरोग्य केंद्र',
    nameEn: 'Health Center',
    phone: '+91 12345 44444',
    description: 'प्राथमिक आरोग्य सेवा',
    icon: 'Heart',
    color: 'from-green-500 to-emerald-600',
    priority: 'medium',
    category: 'आरोग्य',
    order: 3,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-5',
    name: 'आपत्ती व्यवस्थापन',
    nameEn: 'Disaster Management',
    phone: '+91 12345 55555',
    description: 'नैसर्गिक आपत्ती व्यवस्थापन',
    icon: 'AlertTriangle',
    color: 'from-yellow-500 to-orange-600',
    priority: 'high',
    category: 'आपत्ती',
    order: 4,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-6',
    name: 'MSEB (वीज)',
    nameEn: 'Electricity Department',
    phone: '+91 12345 66666',
    description: 'वीजपुरवठा आणि दुरुस्ती',
    icon: 'Zap',
    color: 'from-yellow-400 to-yellow-600',
    priority: 'medium',
    category: 'सुविधा',
    order: 5,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-7',
    name: 'FPO गट',
    nameEn: 'FPO Group',
    phone: '+91 12345 77777',
    description: 'कृषी उत्पादक संघ',
    icon: 'TreePine',
    color: 'from-green-600 to-teal-600',
    priority: 'low',
    category: 'कृषी',
    order: 6,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-8',
    name: 'वन विभाग',
    nameEn: 'Forest Department',
    phone: '+91 12345 88888',
    description: 'वन संरक्षण आणि व्यवस्थापन',
    icon: 'TreePine',
    color: 'from-green-700 to-green-800',
    priority: 'low',
    category: 'पर्यावरण',
    order: 7,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-9',
    name: 'पाणीपुरवठा',
    nameEn: 'Water Supply',
    phone: '+91 12345 99999',
    description: 'पाणीपुरवठा आणि दुरुस्ती',
    icon: 'Wrench',
    color: 'from-cyan-500 to-blue-600',
    priority: 'medium',
    category: 'सुविधा',
    order: 8,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json(getDemoEmergencyContacts());
    }

    const contacts = await prisma.emergencyContact.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    if (contacts.length === 0) {
      return NextResponse.json(getDemoEmergencyContacts());
    }

    return NextResponse.json(contacts.map(contact => ({
      ...contact,
      isDemo: false
    })));
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return NextResponse.json(getDemoEmergencyContacts());
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, nameEn, phone, description, icon, color, priority, category, order, isActive } = body;

    const contact = await prisma.emergencyContact.create({
      data: {
        name,
        nameEn,
        phone,
        description,
        icon,
        color,
        priority,
        category,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', 'EmergencyContact', contact.id, `Created emergency contact: ${name}`);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating emergency contact:', error);
    return NextResponse.json(
      { error: 'Failed to create emergency contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, name, nameEn, phone, description, icon, color, priority, category, order, isActive } = body;

    // Verify the contact belongs to this subdomain
    const existingContact = await prisma.emergencyContact.findFirst({
      where: { id, subdomainId }
    });

    if (!existingContact) {
      return NextResponse.json({ 
        message: 'Emergency contact not found or access denied' 
      }, { status: 404 });
    }

    const contact = await prisma.emergencyContact.update({
      where: { id },
      data: {
        name,
        nameEn,
        phone,
        description,
        icon,
        color,
        priority,
        category,
        order: order !== undefined ? order : existingContact.order,
        isActive: isActive !== undefined ? isActive : existingContact.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', 'EmergencyContact', contact.id, `Updated emergency contact: ${name}`);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    return NextResponse.json(
      { error: 'Failed to update emergency contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Verify the contact belongs to this subdomain
    const existingContact = await prisma.emergencyContact.findFirst({
      where: { id, subdomainId }
    });

    if (!existingContact) {
      return NextResponse.json({ 
        message: 'Emergency contact not found or access denied' 
      }, { status: 404 });
    }

    await prisma.emergencyContact.delete({
      where: { id },
    });

    await logCrudActivity(request, 'DELETE', 'EmergencyContact', id, `Deleted emergency contact: ${existingContact.name}`);

    return NextResponse.json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete emergency contact' },
      { status: 500 }
    );
  }
}




