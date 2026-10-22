import { prisma } from '../../infrastructure/postgres/client.js';
import { User, Address, UserRole, UserStatus } from '@prisma/client';
import { VerifiedFirebaseToken } from '../../infrastructure/firebase/admin.js';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        artisanProfile: true,
        addresses: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        artisanProfile: true,
      },
    });
  }

  async findByExternalIdentity(provider: string, providerUid: string) {
    const identity = await prisma.externalIdentity.findUnique({
      where: {
        provider_providerUid: {
          provider,
          providerUid,
        },
      },
      include: {
        user: {
          include: {
            artisanProfile: true,
          },
        },
      },
    });
    return identity?.user || null;
  }

  async syncFirebaseUser(token: VerifiedFirebaseToken): Promise<User & { artisanProfile: unknown }> {
    const provider = 'FIREBASE_GOOGLE';
    const email = token.email || `${token.uid}@placeholder.kaarigar.ai`;

    // 1. Check if identity exists
    const existing = await this.findByExternalIdentity(provider, token.uid);
    if (existing) {
      // Update avatar or name if changed
      return prisma.user.update({
        where: { id: existing.id },
        data: {
          name: token.name || existing.name,
          avatarUrl: token.picture || existing.avatarUrl,
        },
        include: {
          artisanProfile: true,
        },
      });
    }

    // 2. Check if user with email exists (link identity)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { artisanProfile: true },
    });

    if (existingUser) {
      await prisma.externalIdentity.create({
        data: {
          userId: existingUser.id,
          provider,
          providerUid: token.uid,
          rawProfile: token as unknown as object,
        },
      });
      return existingUser;
    }

    // 3. Create fresh User, ExternalIdentity, default Cart and Wishlist
    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name: token.name || 'Artisan Guest',
          avatarUrl: token.picture,
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
          identities: {
            create: {
              provider,
              providerUid: token.uid,
              rawProfile: token as unknown as object,
            },
          },
          cart: {
            create: {},
          },
          wishlist: {
            create: {},
          },
        },
        include: {
          artisanProfile: true,
        },
      });

      return newUser;
    });
  }

  async updateProfile(id: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      include: { artisanProfile: true },
    });
  }

  async listAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(userId: string, data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    if (data.isDefault) {
      // Unset other defaults for this user
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAddressById(id: string, userId: string) {
    return prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async deleteAddress(id: string, userId: string) {
    return prisma.address.deleteMany({
      where: { id, userId },
    });
  }
}

export const userRepository = new UserRepository();
