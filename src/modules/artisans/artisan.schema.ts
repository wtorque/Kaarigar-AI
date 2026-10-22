import { z } from 'zod';
import { ArtisanStatus } from '@prisma/client';

export const artisanOnboardingSchema = z.object({
  businessName: z.string().min(2).max(100),
  craftTitle: z.string().min(2).max(100),
  story: z.string().min(10).max(3000).optional(),
  clusterRegion: z.string().min(2).max(100).optional(),
  giTagNumber: z.string().max(50).optional(),
  idDocumentType: z.string().min(2).max(50).optional(),
  idDocumentNumber: z.string().min(4).max(100).optional(),
  payoutBankDetails: z
    .object({
      bankName: z.string().min(2).max(100).optional(),
      accountNumber: z.string().min(6).max(30),
      ifscCode: z.string().min(4).max(20),
      accountHolderName: z.string().min(2).max(100),
    })
    .optional(),
});

export type ArtisanOnboardingInput = z.infer<typeof artisanOnboardingSchema>;

export const verifyArtisanSchema = z.object({
  status: z.nativeEnum(ArtisanStatus),
  reviewNotes: z.string().max(1000).optional(),
});

export type VerifyArtisanInput = z.infer<typeof verifyArtisanSchema>;
