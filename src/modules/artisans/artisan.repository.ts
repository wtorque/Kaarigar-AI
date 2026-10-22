import { prisma } from '../../infrastructure/postgres/client.js';
import { ArtisanOnboardingInput, VerifyArtisanInput } from './artisan.schema.js';
import { UserRole, ArtisanStatus } from '@prisma/client';

export class ArtisanRepository {
  async findByUserId(userId: string) {
    return prisma.artisanProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
        _count: { select: { products: true, catalogueJobs: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.artisanProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        products: {
          where: { status: 'PUBLISHED' },
          include: { images: true, variants: true },
          take: 12,
        },
      },
    });
  }

  async createOnboarding(userId: string, data: ArtisanOnboardingInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create or update ArtisanProfile
      const profile = await tx.artisanProfile.create({
        data: {
          userId,
          businessName: data.businessName,
          craftTitle: data.craftTitle,
          story: data.story,
          clusterRegion: data.clusterRegion,
          giTagNumber: data.giTagNumber,
          idDocumentType: data.idDocumentType,
          idDocumentNumber: data.idDocumentNumber,
          payoutBankDetails: data.payoutBankDetails as unknown as object,
          status: ArtisanStatus.PENDING,
        },
      });

      // 2. Upgrade user role to ARTISAN
      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.ARTISAN },
      });

      // 3. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: 'ARTISAN_ONBOARDING_SUBMITTED',
          resource: 'ArtisanProfile',
          resourceId: profile.id,
          metadata: { businessName: data.businessName, craftTitle: data.craftTitle },
        },
      });

      return profile;
    });
  }

  async listApplications(status?: ArtisanStatus) {
    return prisma.artisanProfile.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateVerification(id: string, adminUserId: string, data: VerifyArtisanInput) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.artisanProfile.update({
        where: { id },
        data: {
          status: data.status,
          verificationNotes: data.reviewNotes,
        },
        include: { user: true },
      });

      // Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: `ARTISAN_STATUS_${data.status}`,
          resource: 'ArtisanProfile',
          resourceId: id,
          metadata: { newStatus: data.status, reviewNotes: data.reviewNotes },
        },
      });

      // Create in-app notification for the artisan
      await tx.notification.create({
        data: {
          userId: updated.userId,
          type: 'ARTISAN_VERIFICATION',
          title: `Artisan Profile ${data.status === 'VERIFIED' ? 'Approved' : 'Status Update'}`,
          message:
            data.status === 'VERIFIED'
              ? 'Congratulations! Your artisan profile has been verified. You can now publish handcrafted products to the global catalogue.'
              : `Your artisan profile status is now ${data.status}. Reason: ${data.reviewNotes || 'Verification review updated.'}`,
        },
      });

      return updated;
    });
  }
}

export const artisanRepository = new ArtisanRepository();
