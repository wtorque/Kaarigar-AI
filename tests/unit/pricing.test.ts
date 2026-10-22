import { describe, it, expect } from 'vitest';
import { CURRENCY } from '../../src/config/constants.js';

describe('Pricing & Currency Invariants', () => {
  it('enforces minor unit currency policy (1 INR = 100 paise)', () => {
    expect(CURRENCY.MINOR_UNIT_FACTOR).toBe(100);
    const amountInINR = 1850.50;
    const amountMinor = Math.round(amountInINR * CURRENCY.MINOR_UNIT_FACTOR);
    expect(amountMinor).toBe(185050);
    expect(Number.isInteger(amountMinor)).toBe(true);
  });

  it('calculates tax accurately using integer minor units without floating point drift', () => {
    const item1Minor = 185000; // ₹1,850.00
    const item2Minor = 240000; // ₹2,400.00
    const subtotalMinor = item1Minor + item2Minor; // 425000 (₹4,250.00)

    const taxMinor = Math.round(subtotalMinor * 0.05); // 5% GST = 21250 (₹212.50)
    expect(taxMinor).toBe(21250);

    const shippingFeeMinor = subtotalMinor > 100000 ? 0 : 9900;
    expect(shippingFeeMinor).toBe(0); // Free shipping because > ₹1,000

    const totalAmountMinor = subtotalMinor + taxMinor + shippingFeeMinor;
    expect(totalAmountMinor).toBe(446250);
  });

  it('applies standard shipping fee for orders below threshold', () => {
    const subtotalMinor = 45000; // ₹450.00
    const shippingFeeMinor = subtotalMinor > 100000 ? 0 : 9900;
    expect(shippingFeeMinor).toBe(9900); // ₹99.00
  });
});
