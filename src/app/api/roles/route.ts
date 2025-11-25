import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

// Demo data for roles
const getDemoRoles = () => [
  {
    id: 'demo-1',
    title: 'सरपंच',
    titleEn: 'Sarpanch',
    description: 'ग्रामपंचायतचे मुख्य प्रमुख आणि निर्णय घेणारा अधिकारी',
    responsibilities: [
      'ग्रामपंचायतचे नेतृत्व आणि मार्गदर्शन',
      'सर्व निर्णयांवर अंतिम मत',
      'सरकारी योजनांची अंमलबजावणी',
      'नागरिकांच्या समस्यांचे निराकरण',
      'अर्थसंकल्पाचे व्यवस्थापन'
    ],
    icon: 'Users',
    color: 'from-blue-500 to-indigo-600',
    order: 0,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-2',
    title: 'उपसरपंच',
    titleEn: 'Up-Sarpanch',
    description: 'सरपंचाच्या अनुपस्थितीत कार्यभार सांभाळणारा अधिकारी',
    responsibilities: [
      'सरपंचाच्या अनुपस्थितीत कार्यभार',
      'सरपंचाला सहाय्य आणि सल्ला',
      'विकास कामांचे निरीक्षण',
      'नागरिकांच्या तक्रारींचे निराकरण',
      'बैठकींचे आयोजन'
    ],
    icon: 'Shield',
    color: 'from-green-500 to-emerald-600',
    order: 1,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-3',
    title: 'ग्रामसेवक',
    titleEn: 'Gramsevak',
    description: 'ग्रामपंचायतचे प्रशासकीय अधिकारी आणि कार्यकारी',
    responsibilities: [
      'दैनंदिन प्रशासकीय कामकाज',
      'कागदपत्रांचे व्यवस्थापन',
      'सरकारी योजनांची अंमलबजावणी',
      'नागरिक सेवांची देखरेख',
      'अहवाल तयार करणे'
    ],
    icon: 'FileText',
    color: 'from-purple-500 to-pink-600',
    order: 2,
    isActive: true,
    subdomainId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'demo-4',
    title: 'सदस्य',
    titleEn: 'Member',
    description: 'ग्रामपंचायतचे निर्वाचित सदस्य आणि प्रतिनिधी',
    responsibilities: [
      'ग्रामपंचायत बैठकींमध्ये सहभाग',
      'निर्णय घेण्यात सहाय्य',
      'वॉर्डच्या विकासाची जबाबदारी',
      'नागरिकांच्या समस्यांचे निराकरण',
      'सरकारी योजनांचा प्रचार'
    ],
    icon: 'Home',
    color: 'from-orange-500 to-red-600',
    order: 3,
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
      return NextResponse.json(getDemoRoles());
    }

    const roles = await prisma.role.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    if (roles.length === 0) {
      return NextResponse.json(getDemoRoles());
    }

    return NextResponse.json(roles.map(role => ({
      ...role,
      isDemo: false
    })));
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(getDemoRoles());
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
    const { title, titleEn, description, responsibilities, icon, color, order, isActive } = body;

    const role = await prisma.role.create({
      data: {
        title,
        titleEn,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        icon,
        color,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', 'Role', role.id, `Created role: ${title}`);

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
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
    const { id, title, titleEn, description, responsibilities, icon, color, order, isActive } = body;

    // Verify the role belongs to this subdomain
    const existingRole = await prisma.role.findFirst({
      where: { id, subdomainId }
    });

    if (!existingRole) {
      return NextResponse.json({ 
        message: 'Role not found or access denied' 
      }, { status: 404 });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : existingRole.responsibilities,
        icon,
        color,
        order: order !== undefined ? order : existingRole.order,
        isActive: isActive !== undefined ? isActive : existingRole.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', 'Role', role.id, `Updated role: ${title}`);

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
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

    // Verify the role belongs to this subdomain
    const existingRole = await prisma.role.findFirst({
      where: { id, subdomainId }
    });

    if (!existingRole) {
      return NextResponse.json({ 
        message: 'Role not found or access denied' 
      }, { status: 404 });
    }

    await prisma.role.delete({
      where: { id },
    });

    await logCrudActivity(request, 'DELETE', 'Role', id, `Deleted role: ${existingRole.title}`);

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}


