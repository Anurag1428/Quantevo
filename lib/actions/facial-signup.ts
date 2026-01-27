/**
 * Sign-up with Facial Registration Service
 * Integrates facial registration into the sign-up flow
 */

import { registerFacialProfile } from '@/lib/facial-utils';

export interface FacialRegistrationResult {
  success: boolean;
  message: string;
  profileId?: string;
  error?: string;
}

/**
 * Register facial profile during sign-up
 * Optional step - user can skip and use email/password only
 */
export async function registerFaceOnSignUp(
  email: string,
  faceDescriptor: string,
  fullName: string
): Promise<FacialRegistrationResult> {
  try {
    const result = await registerFacialProfile({
      email,
      faceDescriptor,
      fullName,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to register facial profile',
        error: result.error,
      };
    }

    return {
      success: true,
      message: 'Facial profile registered successfully!',
      profileId: result.profile?.id,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: 'Failed to register facial profile',
      error: errorMsg,
    };
  }
}
