import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button UI Component", () => {
  it("renders with correct text and primary styles", () => {
    render(<Button variant="primary">Explore Marketplace</Button>);
    const btn = screen.getByRole("button", { name: /explore marketplace/i });
    expect(btn).toBeDefined();
    expect(btn.className).toContain("bg-[#76513B]");
  });

  it("applies pill rounded class when isPill is true", () => {
    render(<Button isPill>Pill Button</Button>);
    const btn = screen.getByRole("button", { name: /pill button/i });
    expect(btn.className).toContain("rounded-full");
  });
});
