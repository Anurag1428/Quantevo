/**
 * Facial Recognition Database Operations
 * Uses Prisma ORM with PostgreSQL
 */

import prisma from '@/lib/prisma';

export type FacialProfile = {
  id: string;
  email: string;
  fullName: string;
  faceDescriptor: string;
  registeredAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
};

export const facialDB = {
  // Register a new facial profile (or update existing)
  async registerFace(
    email: string,
    faceDescriptor: string,
    fullName: string
  ): Promise<FacialProfile> {
    try {
      const profile = await prisma.facialProfile.upsert({
        where: { email },
        update: {
          faceDescriptor,
          fullName,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          email,
          fullName,
          faceDescriptor,
          isActive: true,
        },
      });

      console.log(`[Facial DB] Registered face for ${email}`);
      return profile;
    } catch (error) {
      console.error('[Facial DB] Error registering face:', error);
      throw error;
    }
  },

  // Get facial profile by email
  async getFacialProfile(email: string): Promise<FacialProfile | null> {
    try {
      const profile = await prisma.facialProfile.findUnique({
        where: { email },
      });

      if (!profile) {
        console.log(`[Facial DB] No facial profile found for ${email}`);
      }
      return profile;
    } catch (error) {
      console.error('[Facial DB] Error getting facial profile:', error);
      return null;
    }
  },

  // Update last used timestamp
  async updateLastUsed(email: string): Promise<void> {
    try {
      await prisma.facialProfile.update({
        where: { email },
        data: { lastUsedAt: new Date() },
      });
    } catch (error) {
      console.error('[Facial DB] Error updating last used:', error);
    }
  },

  // Delete facial profile
  async deleteFace(email: string): Promise<boolean> {
    try {
      const result = await prisma.facialProfile.delete({
        where: { email },
      });

      if (result) {
        console.log(`[Facial DB] Deleted facial profile for ${email}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Facial DB] Error deleting face:', error);
      return false;
    }
  },

  // Check if facial profile exists
  async hasFaceRegistered(email: string): Promise<boolean> {
    try {
      const profile = await prisma.facialProfile.findUnique({
        where: { email },
      });
      return !!profile;
    } catch (error) {
      console.error('[Facial DB] Error checking face registration:', error);
      return false;
    }
  },

  // Get all profiles (admin only)
  async getAllProfiles(): Promise<FacialProfile[]> {
    try {
      return await prisma.facialProfile.findMany({
        orderBy: { registeredAt: 'desc' },
      });
    } catch (error) {
      console.error('[Facial DB] Error getting all profiles:', error);
      return [];
    }
  },

  // Disable facial profile (soft delete)
  async disableFace(email: string): Promise<boolean> {
    try {
      const result = await prisma.facialProfile.update({
        where: { email },
        data: { isActive: false },
      });
      return !!result;
    } catch (error) {
      console.error('[Facial DB] Error disabling face:', error);
      return false;
    }
  },

  // Get stats (for admin dashboard)
  async getStats() {
    try {
      const totalProfiles = await prisma.facialProfile.count();
      const activeProfiles = await prisma.facialProfile.count({
        where: { isActive: true },
      });
      const recentLogins = await prisma.facialProfile.findMany({
        where: { lastUsedAt: { not: null } },
        orderBy: { lastUsedAt: 'desc' },
        take: 10,
      });

      return {
        totalProfiles,
        activeProfiles,
        inactiveProfiles: totalProfiles - activeProfiles,
        recentLogins,
      };
    } catch (error) {
      console.error('[Facial DB] Error getting stats:', error);
      return null;
    }
  },
};
