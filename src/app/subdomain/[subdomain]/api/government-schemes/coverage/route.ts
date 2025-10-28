import { NextRequest, NextResponse } from 'next/server';

// Static sample ward-wise coverage data; replace with real DB when available
export async function GET(_request: NextRequest) {
  const data = [
    { ward: 'वॉर्ड 1', beneficiaries: 120 },
    { ward: 'वॉर्ड 2', beneficiaries: 85 },
    { ward: 'वॉर्ड 3', beneficiaries: 160 },
    { ward: 'वॉर्ड 4', beneficiaries: 95 }
  ];
  return NextResponse.json(data);
}

// Handle other HTTP methods
export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT(_request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}


