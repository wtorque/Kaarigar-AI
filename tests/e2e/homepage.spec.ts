import { test, expect } from "@playwright/test";

test.describe("Kaarigar AI Homepage and Navigation", () => {
  test("loads homepage with correct brand and editorial hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Kaarigar AI/i);

    // Verify Brand Logo & Navigation
    await expect(page.getByText("Artisans • People • Opportunities").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Crafted by Real People/i })).toBeVisible();

    // Verify Trust Pillars
    await expect(page.getByText("Authentic Products").first()).toBeVisible();
    await expect(page.getByText("Direct from Artisans").first()).toBeVisible();

    // Verify Trending Categories
    await expect(page.getByText("Trending Categories")).toBeVisible();
    await expect(page.getByText("Handicrafts").first()).toBeVisible();
    await expect(page.getByText("Textiles").first()).toBeVisible();

    // Verify Featured Products
    await expect(page.getByText("Featured Products")).toBeVisible();
    await expect(page.getByText("Handcarved Wooden Elephant").first()).toBeVisible();
    await expect(page.getByText("Chanderi Silk Saree").first()).toBeVisible();
  });

  test("can navigate to marketplace and filter by category", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.getByRole("heading", { name: /Handcrafted Treasures of India/i })).toBeVisible();

    // Click Textiles filter
    await page.getByRole("button", { name: "Textiles" }).click();
    await expect(page).toHaveURL(/category=textiles/);
  });

  test("opens AI Catalogue Studio and allows craft analysis", async ({ page }) => {
    await page.goto("/dashboard/ai-catalogue");
    await expect(page.getByRole("heading", { name: /AI Catalogue Studio/i })).toBeVisible();

    // Trigger AI analysis
    await page.getByRole("button", { name: /Analyze with Kaarigar AI/i }).click();
    await expect(page.getByText(/Review & Publish Listing/i)).toBeVisible({ timeout: 10000 });
  });
});
