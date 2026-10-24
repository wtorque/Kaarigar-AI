import { describe, it, expect } from "vitest";
import { formatINR, slugify } from "@/lib/utilities/cn";

describe("Formatting and String Utilities", () => {
  it("formats Indian Rupees currency correctly", () => {
    const formatted = formatINR(1299);
    expect(formatted).toContain("1,299");
  });

  it("slugifies craft titles properly", () => {
    expect(slugify("Handcarved Wooden Elephant")).toBe("handcarved-wooden-elephant");
    expect(slugify("Chanderi Silk Saree & Stole!")).toBe("chanderi-silk-saree-stole");
  });
});
