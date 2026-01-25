import { NextRequest, NextResponse } from 'next/server';
import { facialDB } from '@/lib/db/facial-data';

/**
 * POST /api/facial/register
 * Register or update facial descriptor for a user
 * Body: { email, faceDescriptor, fullName }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, faceDescriptor, fullName } = await request.json();

    // Validate input
    if (!email || !faceDescriptor) {
      return NextResponse.json(
        { error: 'Email and faceDescriptor are required' },
        { status: 400 }
      );
    }

    // TODO (Phase 2): Validate email against registered user in database
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Register facial profile
    const profile = await facialDB.registerFace(
      email,
      faceDescriptor,
      fullName || 'User'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Facial profile registered successfully',
        profile: {
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          registeredAt: profile.registeredAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Facial Register Error]', error);
    return NextResponse.json(
      { error: 'Failed to register facial profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/facial/register?email=user@example.com
 * Check if user has facial profile registered
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const hasRegistered = await facialDB.hasFaceRegistered(email);

    return NextResponse.json({
      email,
      hasFacialProfile: hasRegistered,
    });
  } catch (error) {
    console.error('[Facial Register GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to check facial profile' },
      { status: 500 }
    );
  }
}
