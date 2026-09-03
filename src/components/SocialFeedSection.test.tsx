import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("@/lib/socialFeed", async () => {
  const real = await vi.importActual<typeof import("@/lib/socialFeed")>("@/lib/socialFeed");
  return {
    ...real,
    SOCIAL_FEED_WIDGET: {
      scriptSrc: "https://widget.example/platform.js",
      containerHtml: '<div class="widget-x"></div>',
    },
  };
});

import SocialFeedSection from "./SocialFeedSection";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.querySelectorAll("script[src^='https://widget.example']").forEach((s) => s.remove());
});

describe("SocialFeedSection", () => {
  it("sin consentimiento de marketing no carga el script del proveedor", () => {
    render(<SocialFeedSection />);
    expect(document.querySelector("script[src^='https://widget.example']")).toBeNull();
    expect(screen.getByRole("button", { name: /ajustar cookies/i })).toBeTruthy();
  });

  it("siempre enlaza a los cuatro perfiles", () => {
    render(<SocialFeedSection />);
    const links = screen.getAllByRole("link").map((a) => (a as HTMLAnchorElement).href);
    expect(links.some((h) => h.includes("instagram.com"))).toBe(true);
    expect(links.some((h) => h.includes("tiktok.com"))).toBe(true);
    expect(links.some((h) => h.includes("linkedin.com"))).toBe(true);
    expect(links.some((h) => h.includes("facebook.com"))).toBe(true);
  });
});
