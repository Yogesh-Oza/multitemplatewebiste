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

    const meetings = await prisma.meetingNotification.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Error fetching meeting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting notifications' },
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
      type, 
      date, 
      time, 
      venue, 
      venueEn, 
      agenda, 
      agendaEn, 
      status, 
      priority, 
      attendees, 
      quorum, 
      documents, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    const meeting = await prisma.meetingNotification.create({
      data: {
        title,
        titleEn,
        type,
        date,
        time,
        venue,
        venueEn,
        agenda: agenda || [],
        agendaEn: agendaEn || [],
        status: status || 'upcoming',
        priority: priority || 'medium',
        attendees: attendees || 0,
        quorum: quorum || 0,
        documents: documents || [],
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'MeetingNotification', meeting.id, `Created meeting notification: ${title}`);

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error creating meeting notification:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting notification' },
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
      type, 
      date, 
      time, 
      venue, 
      venueEn, 
      agenda, 
      agendaEn, 
      status, 
      priority, 
      attendees, 
      quorum, 
      documents, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    // Verify the meeting belongs to this subdomain
    const existingMeeting = await prisma.meetingNotification.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMeeting) {
      return NextResponse.json({ 
        message: 'Meeting notification not found or access denied' 
      }, { status: 404 });
    }

    const meeting = await prisma.meetingNotification.update({
      where: { id },
      data: {
        title,
        titleEn,
        type,
        date,
        time,
        venue,
        venueEn,
        agenda: agenda !== undefined ? agenda : existingMeeting.agenda,
        agendaEn: agendaEn !== undefined ? agendaEn : existingMeeting.agendaEn,
        status: status !== undefined ? status : existingMeeting.status,
        priority: priority !== undefined ? priority : existingMeeting.priority,
        attendees: attendees !== undefined ? attendees : existingMeeting.attendees,
        quorum: quorum !== undefined ? quorum : existingMeeting.quorum,
        documents: documents !== undefined ? documents : existingMeeting.documents,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order !== undefined ? order : existingMeeting.order,
        isActive: isActive !== undefined ? isActive : existingMeeting.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'MeetingNotification', meeting.id, `Updated meeting notification: ${title}`);

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error updating meeting notification:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting notification' },
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

    // Verify the meeting belongs to this subdomain
    const existingMeeting = await prisma.meetingNotification.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMeeting) {
      return NextResponse.json({ 
        message: 'Meeting notification not found or access denied' 
      }, { status: 404 });
    }

    await prisma.meetingNotification.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'MeetingNotification', id, `Deleted meeting notification: ${existingMeeting.title}`);

    return NextResponse.json({ message: 'Meeting notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting notification' },
      { status: 500 }
    );
  }
}

