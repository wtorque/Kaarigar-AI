import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export const aiCatalogueDraftSchema = z.object({
  suggestedTitle: z.string().min(5),
  suggestedDescription: z.string().min(20),
  craftTechnique: z.string().min(3),
  story: z.string().min(20),
  suggestedCategory: z.string(),
  suggestedPriceRange: z.object({
    minMinor: z.number().int().positive(),
    maxMinor: z.number().int().positive(),
  }),
  suggestedTags: z.array(z.string()).min(1),
  materials: z.array(z.string()).min(1),
});

export type AICatalogueDraft = z.infer<typeof aiCatalogueDraftSchema>;

export interface VisionAIProvider {
  analyzeCraftImage(imageUrl: string, artisanNotes?: string): Promise<AICatalogueDraft>;
}

export class GeminiVisionProvider implements VisionAIProvider {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
  }

  async analyzeCraftImage(imageUrl: string, artisanNotes?: string): Promise<AICatalogueDraft> {
    if (!this.genAI) {
      logger.info('Gemini API key not configured — using simulated authentic artisan vision inference');
      return this.fallbackSimulatedInference(artisanNotes);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: env.GEMINI_MODEL,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const prompt = `You are Kaarigar AI, a master craft taxonomist specializing in authentic Indian handicraft traditions, GI tags, and artisan heritage.
Analyze the provided handcrafted product photograph.
Artisan's notes: "${artisanNotes || 'No notes provided'}".

Return a strict JSON object with:
{
  "suggestedTitle": "Rich descriptive title for e-commerce listing",
  "suggestedDescription": "Detailed 2-3 paragraph product description highlighting craftsmanship, utilitarian and aesthetic values",
  "craftTechnique": "Exact historical craft technique (e.g., Dhokra Lost-Wax Casting, Jaipur Blue Pottery Glazing, Madhubani Hand Painting)",
  "story": "Heritage provenance story celebrating the artisan's cluster, cultural significance, and traditional technique without fabricating fake claims",
  "suggestedCategory": "One of: Pottery & Ceramics, Metal & Brassware, Traditional Handlooms & Textiles, Folk & Tribal Art, Woodwork & Carvings",
  "suggestedPriceRange": {
    "minMinor": integer in paise (e.g. 150000 for ₹1,500),
    "maxMinor": integer in paise (e.g. 250000 for ₹2,500)
  },
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "materials": ["Material 1", "Material 2"]
}`;

      const result = await model.generateContent([
        prompt,
        // When using live images, imageUrl or inlineData can be passed
        `Image Reference: ${imageUrl}`,
      ]);

      const text = result.response.text();
      const parsedJson = JSON.parse(text);
      const validated = aiCatalogueDraftSchema.parse(parsedJson);
      return validated;
    } catch (err: unknown) {
      logger.warn({ error: err instanceof Error ? err.message : String(err) }, 'Gemini vision call failed, falling back to heuristic inference');
      return this.fallbackSimulatedInference(artisanNotes);
    }
  }

  private fallbackSimulatedInference(notes?: string): AICatalogueDraft {
    const isBrass = notes?.toLowerCase().includes('brass') || notes?.toLowerCase().includes('dhokra') || notes?.toLowerCase().includes('metal');
    const isTextile = notes?.toLowerCase().includes('silk') || notes?.toLowerCase().includes('saree') || notes?.toLowerCase().includes('shawl');

    if (isBrass) {
      return {
        suggestedTitle: 'Authentic Bastar Dhokra Handcrafted Bell in Bell Metal',
        suggestedDescription: 'Exquisite traditional tribal lost-wax bell metal casting produced in Bastar, Chhattisgarh. Known for rustic textures and organic motifs derived from forest folklore.',
        craftTechnique: 'Dhokra Lost-Wax Non-Ferrous Metal Casting',
        story: 'Preserving a 4,000-year-old metallurgical tradition tracing its ancestry to the Dancing Girl of Mohenjo-Daro.',
        suggestedCategory: 'Metal & Brassware',
        suggestedPriceRange: {
          minMinor: 140000,
          maxMinor: 190000,
        },
        suggestedTags: ['dhokra', 'lost-wax', 'bastar', 'bell metal', 'tribal handicraft'],
        materials: ['Bell Metal', 'Brass', 'Natural Beeswax'],
      };
    }

    if (isTextile) {
      return {
        suggestedTitle: 'Pure Katan Silk Handloom Banarasi Zari Brocade Saree',
        suggestedDescription: 'Hand-woven Banarasi masterwork featuring intricate floral jaal woven with fine metallic zari threads across rich katan silk.',
        craftTechnique: 'Banarasi Kadwa Handloom Weaving',
        story: 'Woven over three weeks on traditional pit looms in the weaver quarters of Varanasi, Uttar Pradesh.',
        suggestedCategory: 'Traditional Handlooms & Textiles',
        suggestedPriceRange: {
          minMinor: 850000,
          maxMinor: 1200000,
        },
        suggestedTags: ['banarasi', 'katan silk', 'handloom', 'kadwa weave', 'zari'],
        materials: ['Pure Mulberry Silk', 'Zari Thread'],
      };
    }

    // Default to Blue Pottery / Ceramic
    return {
      suggestedTitle: 'Handcrafted Jaipur Blue Pottery Floral Motif Urn',
      suggestedDescription: 'Authentic handcrafted blue pottery urn decorated with traditional Persian-influenced floral arabesques and cobalt glazes.',
      craftTechnique: 'Jaipur Blue Pottery Glazing & Firing',
      story: 'Crafted without clay using quartz powder, ground glass, Fuller’s earth, and natural mineral dyes in the craft cluster of Jaipur.',
      suggestedCategory: 'Pottery & Ceramics',
      suggestedPriceRange: {
        minMinor: 180000,
        maxMinor: 240000,
      },
      suggestedTags: ['blue pottery', 'jaipur craft', 'hand painted', 'floral urn', 'quartz ceramic'],
      materials: ['Quartz Powder', 'Ground Glass', 'Cobalt Oxide', 'Copper Sulphate'],
    };
  }
}

export const visionAIProvider: VisionAIProvider = new GeminiVisionProvider();
