import { describe, it, expect } from 'vitest';
import { aiCatalogueDraftSchema, visionAIProvider } from '../../src/infrastructure/ai/gemini.js';

describe('AI Vision Cataloguing Pipeline', () => {
  it('validates a well-formed AI generated draft against strict schema', () => {
    const validDraft = {
      suggestedTitle: 'Jaipur Blue Pottery Floral Urn',
      suggestedDescription: 'Authentic handcrafted blue pottery urn decorated with traditional Persian-influenced floral arabesques and cobalt glazes.',
      craftTechnique: 'Jaipur Blue Pottery Glazing & Firing',
      story: 'Crafted without clay using quartz powder, ground glass, and natural mineral dyes in the craft cluster of Jaipur.',
      suggestedCategory: 'Pottery & Ceramics',
      suggestedPriceRange: {
        minMinor: 180000,
        maxMinor: 240000,
      },
      suggestedTags: ['blue pottery', 'jaipur craft', 'hand painted'],
      materials: ['Quartz Powder', 'Cobalt Oxide', 'Copper Sulphate'],
    };

    const parsed = aiCatalogueDraftSchema.safeParse(validDraft);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid draft missing required fields or non-positive price', () => {
    const invalidDraft = {
      suggestedTitle: 'Pot',
      // Missing suggestedDescription, story, craftTechnique
      suggestedPriceRange: {
        minMinor: -50, // Negative price invalid
        maxMinor: 100,
      },
    };

    const parsed = aiCatalogueDraftSchema.safeParse(invalidDraft);
    expect(parsed.success).toBe(false);
  });

  it('generates authentic heritage craft draft using fallback vision inference', async () => {
    const draft = await visionAIProvider.analyzeCraftImage(
      'https://example.com/test.jpg',
      'Handcrafted brass bell from Bastar, Dhokra lost-wax casting'
    );

    expect(draft.craftTechnique).toContain('Dhokra');
    expect(draft.suggestedCategory).toBe('Metal & Brassware');
    expect(draft.suggestedPriceRange.minMinor).toBeGreaterThan(0);
    expect(draft.materials).toContain('Bell Metal');
  });
});
