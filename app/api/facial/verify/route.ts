import { NextRequest, NextResponse } from 'next/server';
import { facialDB } from '@/lib/db/facial-data';

/**
 * Euclidean distance calculation for face descriptor comparison
 * Lower distance = more similar faces
 * Typical threshold: 0.6
 */
function euclideanDistance(descriptor1: Float32Array, descriptor2: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Convert base64 string back to Float32Array
 */
function base64ToDescriptor(base64: string): Float32Array {
  const binaryString = Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

/**
 * POST /api/facial/verify
 * Verify facial descriptor against stored profile
 * Body: { email, faceDescriptor }
 * Response: { isMatch, similarity, confidence }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, faceDescriptor } = await request.json();

    if (!email || !faceDescriptor) {
      return NextResponse.json(
        { error: 'Email and faceDescriptor are required' },
        { status: 400 }
      );
    }

    // Get stored facial profile
    const storedProfile = await facialDB.getFacialProfile(email);

    if (!storedProfile) {
      return NextResponse.json(
        { error: 'No facial profile found for this email' },
        { status: 404 }
      );
    }

    // Convert base64 descriptors back to Float32Array
    const storedDescriptor = base64ToDescriptor(storedProfile.faceDescriptor);
    const currentDescriptor = base64ToDescriptor(faceDescriptor);

    // Calculate distance
    const distance = euclideanDistance(storedDescriptor, currentDescriptor);
    const THRESHOLD = 0.6;
    const isMatch = distance < THRESHOLD;

    // Calculate similarity percentage
    const similarity = Math.max(0, 1 - distance / THRESHOLD);
    const confidence = Math.min(1, similarity);

    // Update last used timestamp if match
    if (isMatch) {
      await facialDB.updateLastUsed(email);
    }

    return NextResponse.json({
      success: true,
      isMatch,
      similarity: Math.round(similarity * 100),
      confidence: Math.round(confidence * 100),
      distance: Math.round(distance * 100) / 100,
      message: isMatch
        ? 'Facial match successful! You can now log in.'
        : 'Facial match failed. Please try again.',
    });
  } catch (error) {
    console.error('[Facial Verify Error]', error);
    return NextResponse.json(
      { error: 'Failed to verify facial profile' },
      { status: 500 }
    );
  }
}
