export type UserRole = "customer" | "artisan" | "admin";

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  artisanProfile?: {
    id: string;
    craft: string;
    region: string;
    bio: string;
    isVerified: boolean;
    yearsOfExperience: number;
    rating: number;
  };
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  avatar: string;
  bannerImage?: string;
  craft: string;
  craftHeritage: string;
  bio: string;
  isVerified: boolean;
  yearsOfExperience: number;
  rating: number;
  reviewsCount: number;
  productsCount: number;
  quote?: string;
  awards?: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  trending?: boolean;
  artisan: {
    id: string;
    slug: string;
    name: string;
    location: string;
    avatar: string;
    isVerified: boolean;
  };
  materials: string[];
  craftTechnique: string;
  dimensions?: string;
  careInstructions?: string;
  tags?: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  artisanName: string;
}

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface AICatalogueResult {
  suggestedTitle: string;
  suggestedCategory: string;
  detectedMaterials: string[];
  craftTechnique: string;
  heritageStory: string;
  recommendedPrice: number;
  pricingBreakdown: {
    materials: number;
    laborHours: number;
    fairLivingWagePerHour: number;
    craftComplexityMultiplier: number;
    fairArtisanMargin: number;
  };
  tags: string[];
}
