import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from './user.service.js';
import { updateProfileSchema, createAddressSchema } from './user.schema.js';

export async function getMeHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const user = await userService.getMe(userId);
  return reply.send({
    success: true,
    data: user,
  });
}

export async function updateMeHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const parsed = updateProfileSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user update payload',
        details: parsed.error.issues,
      },
    });
  }

  const updated = await userService.updateMe(userId, parsed.data);
  return reply.send({
    success: true,
    data: updated,
  });
}

export async function listAddressesHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const addresses = await userService.listAddresses(userId);
  return reply.send({
    success: true,
    data: addresses,
  });
}

export async function createAddressHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const parsed = createAddressSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid address payload',
        details: parsed.error.issues,
      },
    });
  }

  const address = await userService.addAddress(userId, parsed.data);
  return reply.status(201).send({
    success: true,
    data: address,
  });
}

export async function deleteAddressHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const { id } = request.params as { id: string };
  try {
    await userService.deleteAddress(userId, id);
    return reply.send({
      success: true,
      data: { message: 'Address deleted successfully' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete address';
    return reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
      },
    });
  }
}
