import { describe, it, expect, vi } from 'vitest';
import { authorizeRoles, requireVerifiedArtisan } from '../../src/middleware/rbac.middleware.js';
import { UserRole, ArtisanStatus } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('RBAC & Resource Ownership Security Controls', () => {
  it('denies access if user role is not authorized', async () => {
    const middleware = authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN);

    const mockRequest = {
      user: {
        id: 'usr-1',
        email: 'customer@test.com',
        role: UserRole.CUSTOMER,
      },
    } as unknown as FastifyRequest;

    let statusCode = 0;
    let responseBody: unknown;

    const mockReply = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      send(body: unknown) {
        responseBody = body;
        return this;
      },
    } as unknown as FastifyReply;

    await middleware(mockRequest, mockReply);

    expect(statusCode).toBe(403);
    expect(responseBody).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'FORBIDDEN' }),
      })
    );
  });

  it('allows access if user has the required role', async () => {
    const middleware = authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN);

    const mockRequest = {
      user: {
        id: 'usr-admin',
        email: 'admin@kaarigar.ai',
        role: UserRole.ADMIN,
      },
    } as unknown as FastifyRequest;

    const mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    await middleware(mockRequest, mockReply);
    expect(mockReply.status).not.toHaveBeenCalled();
  });

  it('blocks unverified artisans from publishing products', async () => {
    const mockRequest = {
      user: {
        id: 'usr-artisan-pending',
        role: UserRole.ARTISAN,
        artisanProfile: {
          id: 'art-pending',
          status: ArtisanStatus.PENDING,
        },
      },
    } as unknown as FastifyRequest;

    let statusCode = 0;
    const mockReply = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      send() {
        return this;
      },
    } as unknown as FastifyReply;

    await requireVerifiedArtisan(mockRequest, mockReply);
    expect(statusCode).toBe(403);
  });

  it('allows verified artisans to publish products', async () => {
    const mockRequest = {
      user: {
        id: 'usr-artisan-verified',
        role: UserRole.ARTISAN,
        artisanProfile: {
          id: 'art-verified',
          status: ArtisanStatus.VERIFIED,
        },
      },
    } as unknown as FastifyRequest;

    const mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    await requireVerifiedArtisan(mockRequest, mockReply);
    expect(mockReply.status).not.toHaveBeenCalled();
  });
});
