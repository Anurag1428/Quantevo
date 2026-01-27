/**
 * Sign-in with Facial Recognition Service
 * Integrates facial verification into the sign-in flow
 */

import { verifyFacialProfile } from '@/lib/facial-utils';
import { facialDB } from '@/lib/db/facial-data';

export interface FacialSignInResult {
  success: boolean;
  email: string;
  message: string;
  isMatch: boolean;
  similarity: number;
  error?: string;
}

/**
 * Sign in user using facial recognition
 * Returns match result and facial data
 */
export async function signInWithFacial(
  email: string,
  faceDescriptor: string
): Promise<FacialSignInResult> {
  try {
    // Verify facial descriptor against stored profile
    const verifyResult = await verifyFacialProfile({
      email,
      faceDescriptor,
    });

    if (!verifyResult.success) {
      return {
        success: false,
        email,
        isMatch: false,
        similarity: 0,
        message: verifyResult.error || 'Facial verification failed',
        error: verifyResult.error,
      };
    }

    if (!verifyResult.isMatch) {
      return {
        success: false,
        email,
        isMatch: false,
        similarity: verifyResult.similarity,
        message: `Face does not match. Similarity: ${verifyResult.similarity}%`,
      };
    }

    // Face matched - user can now log in
    return {
      success: true,
      email,
      isMatch: true,
      similarity: verifyResult.similarity,
      message: 'Facial verification successful! Logging you in...',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      email,
      isMatch: false,
      similarity: 0,
      message: 'Facial verification failed',
      error: errorMsg,
    };
  }
}

/**
 * Check if user has facial profile for quick sign-in
 */
export async function canUseFacialSignIn(email: string): Promise<boolean> {
  try {
    const profile = await facialDB.getFacialProfile(email);
    return profile?.isActive || false;
  } catch (error) {
    console.error('Error checking facial profile:', error);
    return false;
  }
}
