import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    return NextResponse.json({ 
      message: 'Hello from API',
      timestamp: new Date().toISOString(),
      database: 'Connected to PostgreSQL'
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ 
    message: 'Data received',
    data: body
  });
}
