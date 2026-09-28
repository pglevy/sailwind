import { describe, it, expect } from "vitest";
import * as LucideIcons from "lucide-react";
import {
  alternatingAnimations,
  getIconAnimation,
  iconAnimationDescriptions,
  iconAnimationTargets,
  strokeDrawAnimations,
  toIconSlug,
  type IconAnimation,
} from "./iconAnimations";

/** Every unique Lucide glyph, de-duplicated the same way the gallery does it. */
const allIconNames: string[] = (() => {
  const byComponent = new Map<unknown, string>();
  for (const name of Object.keys(LucideIcons)) {
    if (!/^[A-Z]/.test(name)) continue;
    if (["Icon", "LucideIcon", "IconNode"].includes(name)) continue;
    const value = (LucideIcons as Record<string, unknown>)[name];
    if (value == null) continue;
    if (typeof value !== "function" && typeof value !== "object") continue;
    const existing = byComponent.get(value);
    if (!existing) {
      byComponent.set(value, name);
      continue;
    }
    const existingSuffixed = existing.endsWith("Icon");
    const candidateSuffixed = name.endsWith("Icon");
    if (existingSuffixed && !candidateSuffixed) byComponent.set(value, name);
    else if (existingSuffixed === candidateSuffixed && name.length < existing.length)
      byComponent.set(value, name);
  }
  return Array.from(byComponent.values()).sort();
})();

describe("toIconSlug", () => {
  it("converts Lucide export names to their published kebab-case names", () => {
    expect(toIconSlug("ChevronRight")).toBe("chevron-right");
    expect(toIconSlug("Volume2")).toBe("volume-2");
    expect(toIconSlug("Trash2")).toBe("trash-2");
    expect(toIconSlug("AArrowDown")).toBe("a-arrow-down");
    expect(toIconSlug("Grid2x2")).toBe("grid-2x2");
  });

  it("is a no-op for names that are already slugs", () => {
    expect(toIconSlug("chevron-right")).toBe("chevron-right");
  });
});

describe("getIconAnimation - concept matching", () => {
  // The behaviors called out when this was specified
  const expectations: Array<[string, IconAnimation]> = [
    ["Search", "sweep"],
    ["Settings", "spin"],
    ["X", "draw"],
    ["Plus", "pulse"],
    ["Pencil", "scribble"],
    ["ChevronRight", "nudge-right"],
    ["ChevronLeft", "nudge-left"],
    ["ChevronUp", "nudge-up"],
    ["ChevronDown", "nudge-down"],
    ["ArrowRight", "nudge-right"],
    ["ArrowUp", "nudge-up"],
    ["Sparkles", "twinkle"],
  ];

  expectations.forEach(([name, animation]) => {
    it(`${name} → ${animation}`, () => {
      expect(getIconAnimation(name)).toBe(animation);
    });
  });

  it("keeps X and Check as draw-on rather than a pulse", () => {
    ["X", "Check", "CheckCheck", "CircleX", "SquareCheck"].forEach((name) => {
      expect(getIconAnimation(name)).toBe("draw");
    });
  });

  it("only twinkles the accessory shapes, leaving the main shape still", () => {
    expect(iconAnimationTargets.twinkle).toBe("accessory");
    expect(getIconAnimation("Sparkles")).toBe("twinkle");
  });

  it("moves the search icon instead of drawing it on", () => {
    expect(getIconAnimation("Search")).toBe("sweep");
    expect(iconAnimationTargets.sweep).toBe("lastTwo");
  });

  it("matches other concept families", () => {
    const cases: Array<[string, IconAnimation]> = [
      ["Cog", "spin"],
      ["RefreshCw", "spin"],
      ["LoaderCircle", "spin"],
      ["Bell", "swing"],
      ["Phone", "swing"],
      ["Heart", "beat"],
      ["Wifi", "wave"],
      ["Volume2", "wave"],
      ["BatteryCharging", "wave"],
      ["Clock", "tick"],
      ["Timer", "tick"],
      ["Sun", "rays"],
      ["CloudRain", "fall"],
      ["Cloud", "drift"],
      ["Layers", "pile"],
      ["List", "pile"],
      ["ChartBar", "grow"],
      ["TrendingUp", "grow"],
      ["File", "flip"],
      ["Folder", "flip"],
      ["Mail", "flip"],
      ["Calendar", "flip"],
      ["MapPin", "drop"],
      ["Bookmark", "drop"],
      ["Lock", "latch"],
      ["Shield", "latch"],
      ["User", "pop"],
      ["MessageCircle", "pop"],
      ["TriangleAlert", "shake"],
      ["Trash2", "shake"],
      ["Eye", "blink"],
      ["Download", "nudge-down"],
      ["Upload", "nudge-up"],
      ["Play", "nudge-right"],
      ["Undo", "nudge-left"],
      ["ArrowUpDown", "swap-y"],
      ["ArrowLeftRight", "swap-x"],
      ["Star", "twinkle"],
      ["PenTool", "scribble"],
    ];
    cases.forEach(([name, animation]) => {
      expect(getIconAnimation(name), name).toBe(animation);
    });
  });

  it("moves the objects in align icons until they match the guide", () => {
    const cases: Array<[string, IconAnimation]> = [
      // Guide is a vertical line, so the objects travel horizontally
      ["AlignStartVertical", "align-left"],
      ["AlignEndVertical", "align-right"],
      ["AlignCenterVertical", "align-center-x"],
      // Guide is a horizontal line, so the objects travel vertically
      ["AlignStartHorizontal", "align-up"],
      ["AlignEndHorizontal", "align-down"],
      ["AlignCenterHorizontal", "align-center-y"],
      // Spacing families converge along their axis
      ["AlignHorizontalDistributeCenter", "align-center-x"],
      ["AlignHorizontalJustifyStart", "align-center-x"],
      ["AlignHorizontalSpaceBetween", "align-center-x"],
      ["AlignVerticalDistributeEnd", "align-center-y"],
      ["AlignVerticalSpaceAround", "align-center-y"],
      // Text alignment slides the lines to the alignment edge
      ["AlignLeft", "align-left"],
      ["AlignRight", "align-right"],
      ["AlignCenter", "align-center-x"],
      ["AlignJustify", "align-center-x"],
      ["IndentIncrease", "align-right"],
      ["IndentDecrease", "align-left"],
    ];
    cases.forEach(([name, animation]) => {
      expect(getIconAnimation(name), name).toBe(animation);
    });
  });

  it("no longer piles the align icons", () => {
    const aligned = allIconNames.filter((n) => toIconSlug(n).startsWith("align-"));
    expect(aligned.length).toBeGreaterThan(20);
    aligned.forEach((name) => {
      expect(getIconAnimation(name), name).toMatch(/^align-/);
    });
  });

  it("targets the objects, not the guide, for align animations", () => {
    (["align-left", "align-right", "align-up", "align-down", "align-center-x", "align-center-y"] as const)
      .forEach((animation) => expect(iconAnimationTargets[animation]).toBe("objects"));
  });

  it("marks only the converging animations as alternating", () => {
    expect([...alternatingAnimations].sort()).toEqual(["align-center-x", "align-center-y"]);
  });

  it("treats -off icons as a slash, whatever the base concept is", () => {
    ["BellOff", "WifiOff", "EyeOff", "MicOff", "CloudOff", "PowerOff"].forEach((name) => {
      expect(getIconAnimation(name), name).toBe("slash");
    });
  });

  it("accepts either a component name or a slug", () => {
    expect(getIconAnimation("chevron-right")).toBe(getIconAnimation("ChevronRight"));
    expect(getIconAnimation("cloud-rain")).toBe(getIconAnimation("CloudRain"));
  });
});

describe("getIconAnimation - coverage of the whole icon set", () => {
  it("finds a large set of unique icons to classify", () => {
    expect(allIconNames.length).toBeGreaterThan(1500);
  });

  it("returns a known animation for every single icon", () => {
    const known = new Set(Object.keys(iconAnimationTargets));
    const unknown = allIconNames.filter((name) => !known.has(getIconAnimation(name)));
    expect(unknown).toEqual([]);
  });

  it("assigns a concept animation — not the draw fallback — to most icons", () => {
    const drawn = allIconNames.filter((name) => getIconAnimation(name) === "draw");
    expect(drawn.length / allIconNames.length).toBeLessThan(0.35);
  });

  it("uses every animation it defines at least once", () => {
    const used = new Set(allIconNames.map(getIconAnimation));
    const unused = Object.keys(iconAnimationTargets).filter(
      (animation) => !used.has(animation as IconAnimation)
    );
    expect(unused).toEqual([]);
  });

  it("is deterministic", () => {
    const first = allIconNames.map(getIconAnimation);
    const second = allIconNames.map(getIconAnimation);
    expect(first).toEqual(second);
  });
});

describe("animation registry", () => {
  it("describes every animation", () => {
    Object.keys(iconAnimationTargets).forEach((animation) => {
      expect(iconAnimationDescriptions[animation as IconAnimation]).toBeTruthy();
    });
  });

  it("only asks for pathLength normalization on the stroke-drawing animations", () => {
    expect([...strokeDrawAnimations].sort()).toEqual(["draw", "slash"]);
  });
});
