import { artisanRepository, ArtisanRepository } from './artisan.repository.js';
import { ArtisanOnboardingInput, VerifyArtisanInput } from './artisan.schema.js';
import { ArtisanStatus } from '@prisma/client';

export class ArtisanService {
  constructor(private artisanRepo: ArtisanRepository = artisanRepository) {}

  async submitOnboarding(userId: string, data: ArtisanOnboardingInput) {
    const existing = await this.artisanRepo.findByUserId(userId);
    if (existing) {
      throw new Error('CONFLICT: You have already submitted an artisan profile. Current status: ' + existing.status);
    }
    return this.artisanRepo.createOnboarding(userId, data);
  }

  async getMyProfile(userId: string) {
    const profile = await this.artisanRepo.findByUserId(userId);
    if (!profile) {
      throw new Error('NOT_FOUND: No artisan profile registered for this account');
    }
    return profile;
  }

  async getPublicProfile(artisanId: string) {
    const profile = await this.artisanRepo.findById(artisanId);
    if (!profile) {
      throw new Error('NOT_FOUND: Artisan profile not found');
    }
    return profile;
  }

  async listApplications(status?: ArtisanStatus) {
    return this.artisanRepo.listApplications(status);
  }

  async verifyArtisan(artisanId: string, adminUserId: string, data: VerifyArtisanInput) {
    return this.artisanRepo.updateVerification(artisanId, adminUserId, data);
  }
}

export const artisanService = new ArtisanService();
