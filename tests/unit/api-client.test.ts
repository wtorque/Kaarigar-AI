import { describe, it, expect } from "vitest";
import { api } from "@/lib/api/client";

describe("Kaarigar API Client & Fixture Store", () => {
  it("fetches featured products successfully", async () => {
    const featured = await api.getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured[0]).toHaveProperty("title");
    expect(featured[0]).toHaveProperty("price");
    expect(featured[0].artisan).toHaveProperty("name");
  });

  it("filters products by category correctly", async () => {
    const res = await api.getProducts({ category: "textiles" });
    expect(res.items.length).toBeGreaterThan(0);
    res.items.forEach((item) => {
      expect(item.category).toBe("textiles");
    });
  });

  it("retrieves product by human-readable slug", async () => {
    const product = await api.getProductBySlug("handcarved-wooden-elephant");
    expect(product).not.toBeNull();
    expect(product?.title).toBe("Handcarved Wooden Elephant");
    expect(product?.price).toBe(1299);
    expect(product?.artisan.name).toBe("Suresh Kumar");
  });

  it("lists all craft categories with metadata", async () => {
    const categories = await api.getCategories();
    expect(categories.length).toBe(8);
    const categorySlugs = categories.map((c) => c.slug);
    expect(categorySlugs).toContain("handicrafts");
    expect(categorySlugs).toContain("textiles");
    expect(categorySlugs).toContain("home-decor");
  });

  it("simulates AI Catalogue photo analysis with fair living wage calculation", async () => {
    const analysis = await api.analyzeCraftPhoto("craft-photo-data");
    expect(analysis).toHaveProperty("suggestedTitle");
    expect(analysis).toHaveProperty("heritageStory");
    expect(analysis).toHaveProperty("detectedMaterials");
    expect(analysis.pricingBreakdown.laborHours).toBeGreaterThan(0);
    expect(analysis.recommendedPrice).toBeGreaterThan(0);
  });

  it("creates order and updates status tracking", async () => {
    const newOrder = await api.createOrder({
      items: [
        {
          id: "item_test",
          productId: "prod_1",
          title: "Handcarved Wooden Elephant",
          price: 1299,
          quantity: 1,
          image: "/images/products/wooden-elephant.webp",
          artisanName: "Suresh Kumar",
        },
      ],
      total: 1299,
      paymentMethod: "upi",
    });

    expect(newOrder).toHaveProperty("id");
    expect(newOrder.orderNumber).toMatch(/^KG-2026-/);
    expect(newOrder.status).toBe("placed");
  });
});
