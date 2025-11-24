import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {
      subdomainId,
      isActive: true
    };

    // Filter by date range if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
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
    const { 
      title, 
      titleEn, 
      date, 
      time, 
      duration, 
      venue, 
      venueEn, 
      type, 
      description, 
      descriptionEn, 
      attendees, 
      maxAttendees, 
      status, 
      priority, 
      organizer, 
      organizerEn, 
      contactInfo, 
      documents, 
      reminders, 
      order, 
      isActive 
    } = body;

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        titleEn,
        date,
        time,
        duration,
        venue,
        venueEn,
        type,
        description,
        descriptionEn,
        attendees: attendees || 0,
        maxAttendees: maxAttendees || 0,
        status: status || 'upcoming',
        priority: priority || 'medium',
        organizer,
        organizerEn,
        contactInfo: contactInfo || {},
        documents: documents || [],
        reminders: reminders !== undefined ? reminders : true,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'CalendarEvent', event.id, `Created calendar event: ${title}`);

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
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
    const { 
      id, 
      title, 
      titleEn, 
      date, 
      time, 
      duration, 
      venue, 
      venueEn, 
      type, 
      description, 
      descriptionEn, 
      attendees, 
      maxAttendees, 
      status, 
      priority, 
      organizer, 
      organizerEn, 
      contactInfo, 
      documents, 
      reminders, 
      order, 
      isActive 
    } = body;

    // Verify the event belongs to this subdomain
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: { id, subdomainId }
    });

    if (!existingEvent) {
      return NextResponse.json({ 
        message: 'Calendar event not found or access denied' 
      }, { status: 404 });
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        title,
        titleEn,
        date,
        time,
        duration,
        venue,
        venueEn,
        type,
        description,
        descriptionEn,
        attendees: attendees !== undefined ? attendees : existingEvent.attendees,
        maxAttendees: maxAttendees !== undefined ? maxAttendees : existingEvent.maxAttendees,
        status: status !== undefined ? status : existingEvent.status,
        priority: priority !== undefined ? priority : existingEvent.priority,
        organizer,
        organizerEn,
        contactInfo: contactInfo !== undefined ? contactInfo : existingEvent.contactInfo,
        documents: documents !== undefined ? documents : existingEvent.documents,
        reminders: reminders !== undefined ? reminders : existingEvent.reminders,
        order: order !== undefined ? order : existingEvent.order,
        isActive: isActive !== undefined ? isActive : existingEvent.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'CalendarEvent', event.id, `Updated calendar event: ${title}`);

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
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

    // Verify the event belongs to this subdomain
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: { id, subdomainId }
    });

    if (!existingEvent) {
      return NextResponse.json({ 
        message: 'Calendar event not found or access denied' 
      }, { status: 404 });
    }

    await prisma.calendarEvent.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'CalendarEvent', id, `Deleted calendar event: ${existingEvent.title}`);

    return NextResponse.json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
}

