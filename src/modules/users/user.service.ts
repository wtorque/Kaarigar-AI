import { userRepository, UserRepository } from './user.repository.js';
import { UpdateProfileInput, CreateAddressInput } from './user.schema.js';
import { VerifiedFirebaseToken } from '../../infrastructure/firebase/admin.js';

export class UserService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async authenticateFirebaseToken(token: VerifiedFirebaseToken) {
    const user = await this.userRepo.syncFirebaseUser(token);
    if (user.status === 'SUSPENDED') {
      throw new Error('USER_SUSPENDED: Your account has been suspended. Please contact support.');
    }
    return user;
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('NOT_FOUND: User not found');
    }
    return user;
  }

  async updateMe(userId: string, data: UpdateProfileInput) {
    return this.userRepo.updateProfile(userId, data);
  }

  async listAddresses(userId: string) {
    return this.userRepo.listAddresses(userId);
  }

  async addAddress(userId: string, data: CreateAddressInput) {
    return this.userRepo.createAddress(userId, data);
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.userRepo.findAddressById(addressId, userId);
    if (!existing) {
      throw new Error('NOT_FOUND: Address not found or does not belong to you');
    }
    await this.userRepo.deleteAddress(addressId, userId);
    return { success: true };
  }
}

export const userService = new UserService();
