import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { SandboxPaymentProvider } from '../../src/infrastructure/payments/provider.js';

describe('Payment Webhook Cryptographic Verification', () => {
  const provider = new SandboxPaymentProvider();
  const secret = 'sample_webhook_secret';

  it('successfully verifies a valid HMAC-SHA256 signature', () => {
    const rawPayload = JSON.stringify({
      eventId: 'evt_test_123',
      eventType: 'payment.captured',
      amountMinor: 185000,
    });

    const validSignature = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');
    const result = provider.verifyWebhookSignature(rawPayload, validSignature);

    expect(result).toBe(true);
  });

  it('rejects an invalid or tampered signature', () => {
    const rawPayload = JSON.stringify({
      eventId: 'evt_test_123',
      eventType: 'payment.captured',
      amountMinor: 185000,
    });

    const forgedSignature = crypto.createHmac('sha256', 'wrong_secret').update(rawPayload).digest('hex');
    const result = provider.verifyWebhookSignature(rawPayload, forgedSignature);

    expect(result).toBe(false);
  });

  it('rejects when payload is tampered after signature generation', () => {
    const originalPayload = JSON.stringify({ amountMinor: 185000 });
    const tamperedPayload = JSON.stringify({ amountMinor: 100 }); // Attempted price tampering

    const signature = crypto.createHmac('sha256', secret).update(originalPayload).digest('hex');
    const result = provider.verifyWebhookSignature(tamperedPayload, signature);

    expect(result).toBe(false);
  });
});
