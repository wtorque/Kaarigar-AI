import { Product, Category, Artisan, Order, AICatalogueResult } from "@/types";
import { PRODUCTS, CATEGORIES, ARTISANS, INITIAL_ORDERS } from "./fixtures";

export interface ProductFilterParams {
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price_asc" | "price_desc" | "rating";
  query?: string;
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface ArtisanFilterParams {
  state?: string;
  craft?: string;
  query?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  // In-memory runtime state for mutations in mock mode
  private productsState: Product[] = [...PRODUCTS];
  private ordersState: Order[] = [...INITIAL_ORDERS];

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetchWithFallback<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackFn: () => T | Promise<T>
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data.data !== undefined ? data.data : data;
    } catch {
      // Graceful fallback to mock data layer
      return fallbackFn();
    }
  }

  // 1. Products
  async getProducts(params: ProductFilterParams = {}): Promise<{
    items: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.fetchWithFallback(
      `/products?${new URLSearchParams(params as Record<string, string>).toString()}`,
      { method: "GET" },
      () => {
        let filtered = [...this.productsState];

        if (params.category && params.category !== "all") {
          filtered = filtered.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
        }

        if (params.region) {
          filtered = filtered.filter((p) =>
            p.artisan.location.toLowerCase().includes(params.region!.toLowerCase())
          );
        }

        if (params.query) {
          const q = params.query.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.artisan.name.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (params.minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= params.minPrice!);
        }

        if (params.maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= params.maxPrice!);
        }

        if (params.inStockOnly) {
          filtered = filtered.filter((p) => p.inStock);
        }

        // Sorting
        switch (params.sort) {
          case "price_asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          default:
            // featured
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        const page = params.page || 1;
        const limit = params.limit || 12;
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        return {
          items: paged,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit) || 1,
        };
      }
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.fetchWithFallback("/products/featured", { method: "GET" }, () =>
      this.productsState.filter((p) => p.featured || p.trending)
    );
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.fetchWithFallback(`/products/slug/${slug}`, { method: "GET" }, () => {
      const match = this.productsState.find((p) => p.slug === slug);
      return match || null;
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.fetchWithFallback(`/products/${id}`, { method: "GET" }, () => {
      const match = this.productsState.find((p) => p.id === id);
      return match || null;
    });
  }

  // 2. Categories
  async getCategories(): Promise<Category[]> {
    return this.fetchWithFallback("/categories", { method: "GET" }, () => CATEGORIES);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.fetchWithFallback(`/categories/${slug}`, { method: "GET" }, () => {
      return CATEGORIES.find((c) => c.slug === slug) || null;
    });
  }

  // 3. Artisans
  async getArtisans(params: ArtisanFilterParams = {}): Promise<Artisan[]> {
    return this.fetchWithFallback(
      `/artisans?${new URLSearchParams(params as Record<string, string>).toString()}`,
      { method: "GET" },
      () => {
        let list = [...ARTISANS];
        if (params.state) {
          list = list.filter((a) => a.state.toLowerCase() === params.state?.toLowerCase());
        }
        if (params.craft) {
          list = list.filter((a) => a.craft.toLowerCase().includes(params.craft!.toLowerCase()));
        }
        if (params.query) {
          const q = params.query.toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.craft.toLowerCase().includes(q) ||
              a.location.toLowerCase().includes(q)
          );
        }
        return list;
      }
    );
  }

  async getArtisanBySlug(slug: string): Promise<Artisan | null> {
    return this.fetchWithFallback(`/artisans/slug/${slug}`, { method: "GET" }, () => {
      return ARTISANS.find((a) => a.slug === slug) || null;
    });
  }

  async getArtisanProducts(artisanSlug: string): Promise<Product[]> {
    return this.fetchWithFallback(`/artisans/slug/${artisanSlug}/products`, { method: "GET" }, () => {
      return this.productsState.filter((p) => p.artisan.slug === artisanSlug);
    });
  }

  // 4. Orders & Checkout
  async getOrders(): Promise<Order[]> {
    return this.fetchWithFallback("/orders", { method: "GET" }, () => this.ordersState);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.fetchWithFallback(`/orders/${id}`, { method: "GET" }, () => {
      return this.ordersState.find((o) => o.id === id || o.orderNumber === id) || null;
    });
  }

  async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    return this.fetchWithFallback(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(orderPayload),
      },
      () => {
        const newOrder: Order = {
          id: `ord_${Date.now()}`,
          orderNumber: `KG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString(),
          status: "placed",
          items: orderPayload.items || [],
          subtotal: orderPayload.subtotal || 0,
          discount: orderPayload.discount || 0,
          shipping: orderPayload.shipping || 0,
          total: orderPayload.total || 0,
          shippingAddress: orderPayload.shippingAddress || {
            fullName: "Guest Patron",
            phone: "+91 9876543210",
            street: "Heritage Way",
            city: "Bhopal",
            state: "Madhya Pradesh",
            pincode: "462001",
          },
          paymentMethod: orderPayload.paymentMethod || "upi",
          trackingNumber: `KG-TRK-${Math.floor(100000 + Math.random() * 900000)}IN`,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split("T")[0],
        };
        this.ordersState.unshift(newOrder);
        return newOrder;
      }
    );
  }

  // 5. Artisan Studio & AI Tools
  async analyzeCraftPhoto(imageDataOrDesc: string): Promise<AICatalogueResult> {
    return this.fetchWithFallback(
      "/artisan/ai-catalogue/analyze",
      {
        method: "POST",
        body: JSON.stringify({ image: imageDataOrDesc }),
      },
      () => {
        // High fidelity AI analysis simulation matching Kaarigar vision
        return {
          suggestedTitle: "Handcrafted Terracotta Cutwork Ambient Lamp",
          suggestedCategory: "home-decor",
          detectedMaterials: ["Mineral-rich Alluvial Clay", "Natural Oxide Wash", "Brass E-27 Socket"],
          craftTechnique: "Molela Hand-Pierced Lattice Technique",
          heritageStory:
            "Formed by hand using Banas riverbed clay steeped for three weeks, then hand-punched with delicate floral jali cuts. When illuminated, it projects geometric constellation shadows reminiscent of rural Rajasthan courtyards.",
          recommendedPrice: 1199,
          pricingBreakdown: {
            materials: 240,
            laborHours: 7,
            fairLivingWagePerHour: 95,
            craftComplexityMultiplier: 1.25,
            fairArtisanMargin: 294,
          },
          tags: ["Terracotta", "Pierced Lamp", "Molela Heritage", "Ambient Decor", "Eco-craft"],
        };
      }
    );
  }

  async addArtisanProduct(productPayload: Partial<Product>): Promise<Product> {
    return this.fetchWithFallback(
      "/artisan/products",
      {
        method: "POST",
        body: JSON.stringify(productPayload),
      },
      () => {
        const newProduct: Product = {
          id: `prod_${Date.now()}`,
          slug: (productPayload.title || "new-handcrafted-piece")
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-"),
          title: productPayload.title || "Handcrafted Artisan Item",
          description: productPayload.description || "Authentic handmade piece directly from our workshop.",
          price: productPayload.price || 999,
          originalPrice: productPayload.originalPrice || Math.round((productPayload.price || 999) * 1.3),
          category: productPayload.category || "handicrafts",
          subCategory: productPayload.subCategory || "Handmade",
          rating: 5.0,
          reviewsCount: 1,
          images: productPayload.images?.length
            ? productPayload.images
            : ["/images/products/handpainted-lamp.webp"],
          inStock: true,
          stockCount: productPayload.stockCount || 5,
          featured: false,
          trending: true,
          artisan: productPayload.artisan || {
            id: "art_1",
            slug: "suresh-kumar",
            name: "Suresh Kumar",
            location: "Bastar, CG",
            avatar: "/images/artisans/suresh.webp",
            isVerified: true,
          },
          materials: productPayload.materials || ["Natural Timber", "Organic Wax"],
          craftTechnique: productPayload.craftTechnique || "Traditional Hand Carving",
          dimensions: productPayload.dimensions || "20 x 15 x 10 cm",
          careInstructions: productPayload.careInstructions || "Wipe clean with a dry cloth.",
          tags: productPayload.tags || ["Handmade", "Authentic"],
          createdAt: new Date().toISOString(),
        };

        this.productsState.unshift(newProduct);
        return newProduct;
      }
    );
  }

  async getArtisanDashboardStats() {
    return this.fetchWithFallback("/artisan/dashboard/stats", { method: "GET" }, () => ({
      totalSales: 84650,
      totalOrders: 42,
      activeListings: 18,
      artisanRating: 4.8,
      pendingFulfillment: 3,
      fairLivingHoursLogged: 320,
    }));
  }

  async getAdminMetrics() {
    return this.fetchWithFallback("/admin/metrics", { method: "GET" }, () => ({
      totalGmv: 4892000,
      activeArtisans: 10420,
      totalProducts: 48200,
      pendingVerifications: 14,
      disputeRatePercent: 0.2,
    }));
  }
}

export const api = new ApiClient();
