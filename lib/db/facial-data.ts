/**
 * Facial Recognition Database Schema
 * TODO (PHASE 2): Connect to actual database (PostgreSQL, MongoDB, etc.)
 * For now: Using in-memory storage with file persistence
 */

export interface FacialProfile {
  id: string;
  email: string;
  fullName: string;
  faceDescriptor: string; // Base64 encoded Float32Array
  registeredAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

// In-memory storage (Phase 1)
const facialProfiles = new Map<string, FacialProfile>();

/**
 * Phase 1: In-memory operations
 * Phase 2: Replace with database operations
 */

export const facialDB = {
  // Register a new facial profile
  async registerFace(
    email: string,
    faceDescriptor: string,
    fullName: string
  ): Promise<FacialProfile> {
    // TODO (Phase 2): Check if email already has a facial profile, update if exists
    const id = `${email}-${Date.now()}`;
    const profile: FacialProfile = {
      id,
      email,
      fullName,
      faceDescriptor,
      registeredAt: new Date(),
      isActive: true,
    };

    facialProfiles.set(email, profile);
    console.log(`[Facial DB] Registered face for ${email}`);
    return profile;
  },

  // Get facial profile by email
  async getFacialProfile(email: string): Promise<FacialProfile | null> {
    const profile = facialProfiles.get(email) || null;
    if (!profile) {
      console.log(`[Facial DB] No facial profile found for ${email}`);
    }
    return profile;
  },

  // Update last used timestamp
  async updateLastUsed(email: string): Promise<void> {
    const profile = facialProfiles.get(email);
    if (profile) {
      profile.lastUsedAt = new Date();
      facialProfiles.set(email, profile);
    }
  },

  // Delete facial profile
  async deleteFace(email: string): Promise<boolean> {
    const deleted = facialProfiles.delete(email);
    if (deleted) {
      console.log(`[Facial DB] Deleted facial profile for ${email}`);
    }
    return deleted;
  },

  // Check if facial profile exists
  async hasFaceRegistered(email: string): Promise<boolean> {
    return facialProfiles.has(email);
  },

  // Get all profiles (admin only - TODO: Add auth check)
  async getAllProfiles(): Promise<FacialProfile[]> {
    return Array.from(facialProfiles.values());
  },
};
