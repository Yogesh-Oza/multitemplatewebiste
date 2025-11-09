import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

// Default news items
const defaultNewsItems = [
  {
    title: 'नवीन पाणी पुरवठा योजना यशस्वी',
    description: 'गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा सुनिश्चित करण्यासाठी आधुनिक पंपिंग सिस्टम स्थापना पूर्ण झाली.',
    date: '२३ मार्च २०२४',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    category: 'पायाभूत सुविधा',
    categoryColor: 'bg-blue-500',
    isUrgent: true,
    order: 0,
    isActive: true,
  },
  {
    title: 'शिक्षण क्षेत्रात राज्यस्तरीय पुरस्कार',
    description: 'आमच्या गावातील प्राथमिक शाळेला डिजिटल शिक्षणातील उत्कृष्ट कामगिरीसाठी राज्य सरकारकडून सन्मान मिळाला.',
    date: '१५ फेब्रुवारी २०२४',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center',
    category: 'शिक्षण',
    categoryColor: 'bg-green-500',
    isUrgent: false,
    order: 1,
    isActive: true,
  },
  {
    title: 'स्वच्छता अभियान मोठे यश',
    description: 'गावव्यापी स्वच्छता अभियानात ९८% कुटुंबांनी सहभाग घेतला आणि गावाला \'स्वच्छ गाव\' चा दर्जा मिळाला.',
    date: '८ जानेवारी २०२४',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    category: 'स्वच्छता',
    categoryColor: 'bg-cyan-500',
    isUrgent: false,
    order: 2,
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

    let newsItems = await prisma.newsItem.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    // If no news items exist, create default ones
    if (newsItems.length === 0 && subdomainId) {
      try {
        await prisma.newsItem.createMany({
          data: defaultNewsItems.map(item => ({
            ...item,
            subdomainId: subdomainId,
          })),
        });

        newsItems = await prisma.newsItem.findMany({
          where: { subdomainId },
          orderBy: { order: 'asc' }
        });
      } catch (error) {
        console.error('Error creating default news items:', error);
        return NextResponse.json(defaultNewsItems);
      }
    }

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news items' },
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
    const { title, description, date, imageUrl, category, categoryColor, isUrgent, order, isActive } = body;

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        description,
        date,
        imageUrl,
        category,
        categoryColor,
        isUrgent: isUrgent !== undefined ? isUrgent : false,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error creating news item:', error);
    return NextResponse.json(
      { error: 'Failed to create news item' },
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
    const { id, title, description, date, imageUrl, category, categoryColor, isUrgent, order, isActive } = body;

    const existingItem = await prisma.newsItem.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'News item not found or access denied' 
      }, { status: 404 });
    }

    const newsItem = await prisma.newsItem.update({
      where: { id },
      data: {
        title,
        description,
        date,
        imageUrl,
        category,
        categoryColor,
        isUrgent: isUrgent !== undefined ? isUrgent : existingItem.isUrgent,
        order: order !== undefined ? order : existingItem.order,
        isActive: isActive !== undefined ? isActive : existingItem.isActive,
      },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json(
      { error: 'Failed to update news item' },
      { status: 500 }
    );
  }
}

