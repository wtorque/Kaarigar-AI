import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export interface CheckoutSessionResult {
  paymentId: string;
  provider: string;
  providerReferenceId: string;
  amountMinor: number;
  currency: string;
  expiresAt: Date;
}

export interface PaymentProvider {
  createCheckoutSession(orderId: string, amountMinor: number, currency: string): Promise<CheckoutSessionResult>;
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
}

export class SandboxPaymentProvider implements PaymentProvider {
  async createCheckoutSession(orderId: string, amountMinor: number, currency: string): Promise<CheckoutSessionResult> {
    const providerReferenceId = `sandbox_order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const paymentId = `sandbox_pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    logger.info({ orderId, amountMinor, providerReferenceId }, 'Created Sandbox checkout session');

    return {
      paymentId,
      provider: 'SANDBOX',
      providerReferenceId,
      amountMinor,
      currency,
      expiresAt,
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = env.PAYMENT_WEBHOOK_SECRET || 'sample_webhook_secret';
    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    // Constant time comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }
}

export class RazorpayPaymentProvider implements PaymentProvider {
  async createCheckoutSession(_orderId: string, amountMinor: number, currency: string): Promise<CheckoutSessionResult> {
    const providerReferenceId = `rzp_order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const paymentId = `rzp_pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return {
      paymentId,
      provider: 'RAZORPAY',
      providerReferenceId,
      amountMinor,
      currency,
      expiresAt,
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) return false;

    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (env.PAYMENT_PROVIDER === 'razorpay') {
    return new RazorpayPaymentProvider();
  }
  return new SandboxPaymentProvider();
}

export const paymentProvider = getPaymentProvider();
