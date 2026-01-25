/**
 * Facial Recognition Client Utilities
 * Phase 1: Basic registration and verification
 */

export interface FacialRegistrationRequest {
  email: string;
  faceDescriptor: string;
  fullName: string;
}

export interface FacialVerificationRequest {
  email: string;
  faceDescriptor: string;
}

export interface FacialVerificationResponse {
  success: boolean;
  isMatch: boolean;
  similarity: number; // 0-100
  confidence: number; // 0-100
  distance: number;
  message: string;
  error?: string;
}

export interface FacialRegistrationResponse {
  success: boolean;
  message: string;
  profile?: {
    id: string;
    email: string;
    fullName: string;
    registeredAt: string;
  };
  error?: string;
}

/**
 * Register facial profile for a user
 */
export async function registerFacialProfile(
  data: FacialRegistrationRequest
): Promise<FacialRegistrationResponse> {
  try {
    const response = await fetch('/api/facial/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to register facial profile',
        error: result.error || 'Unknown error',
      };
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: 'Failed to register facial profile',
      error: message,
    };
  }
}

/**
 * Verify facial profile during login
 */
export async function verifyFacialProfile(
  data: FacialVerificationRequest
): Promise<FacialVerificationResponse> {
  try {
    const response = await fetch('/api/facial/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        isMatch: false,
        similarity: 0,
        confidence: 0,
        distance: 0,
        message: 'Failed to verify facial profile',
        error: result.error || 'Unknown error',
      };
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      isMatch: false,
      similarity: 0,
      confidence: 0,
      distance: 0,
      message: 'Failed to verify facial profile',
      error: message,
    };
  }
}

/**
 * Check if user has facial profile registered
 */
export async function checkFacialProfileExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/facial/register?email=${encodeURIComponent(email)}`
    );
    const result = await response.json();
    return result.hasFacialProfile || false;
  } catch (error) {
    console.error('Failed to check facial profile:', error);
    return false;
  }
}
