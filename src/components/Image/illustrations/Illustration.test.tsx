import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageField } from "../ImageField";
import { ILLUSTRATIONS } from "./illustrationSpecs";
import type { IllustrationName, IllustrationSpec, RadialSpec, StackSpec } from "./illustrationSpecs";

const svgOf = (container: HTMLElement) => container.querySelector("svg") as SVGSVGElement;

const drawn = (illustration: IllustrationName, showAnimation?: boolean, size?: "LARGE" | "ICON_PLUS") =>
  render(<ImageField images={[{ imageType: "illustration", illustration, showAnimation }]} size={size} />);

const ALL = Object.entries(ILLUSTRATIONS) as [IllustrationName, IllustrationSpec][];
const RADIAL = ALL.filter((entry): entry is [IllustrationName, RadialSpec] => entry[1].kind !== "STACK");
const STACKS = ALL.filter((entry): entry is [IllustrationName, StackSpec] => entry[1].kind === "STACK");

describe("illustration image - accessibility", () => {
  it("is decorative: hidden from assistive technology and not focusable", () => {
    const { container } = drawn("TRIGGERS");
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });
});

describe("illustration image - size", () => {
  it("takes its size from ImageField's size, and carries its drawn size as its natural size", () => {
    const { container } = drawn("NO_DATA", undefined, "LARGE");
    const svg = svgOf(container);
    expect(svg).toHaveClass("w-96", "max-w-full");
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "176");
  });
});

describe("illustration image - animation", () => {
  it("animates by default", () => {
    const { container } = drawn("TEST_CASES");
    expect(svgOf(container)).toHaveClass("sw-illustration-animated");
  });

  it("does not animate when showAnimation is false", () => {
    const { container } = drawn("TEST_CASES", false);
    expect(svgOf(container)).not.toHaveClass("sw-illustration-animated");
  });
});

describe("illustration image - unknown name", () => {
  it("draws nothing, rather than throwing, for a name that is not in the list", () => {
    const unknown = "NOT_AN_ILLUSTRATION" as IllustrationName;
    expect(() => drawn(unknown)).not.toThrow();
    const { container } = drawn(unknown);
    expect(container.querySelector("svg")).toBeNull();
  });
});

describe("illustration image - ImageField", () => {
  it("does not draw an illustration whose image has showWhen false, and still draws one without it", () => {
    const { container } = render(
      <ImageField
        images={[
          { imageType: "illustration", illustration: "NO_DATA" },
          { imageType: "illustration", illustration: "HISTORY", showWhen: false },
          { document: "a.png", showWhen: false },
        ]}
      />
    );
    expect(container.querySelectorAll("svg.sw-illustration-animated")).toHaveLength(1);
    expect(container.querySelector("img")).toBeNull();
  });

  it("applies only the size to an illustration, not style, shape or isThumbnail", () => {
    const { container } = render(
      <ImageField images={[{ imageType: "illustration", illustration: "NO_DATA" }]} size="LARGE" style="AVATAR" shape="ROUNDED" isThumbnail />
    );
    const svg = svgOf(container);
    expect(svg).toHaveClass("w-96");
    for (const cls of ["rounded-full", "rounded-md", "cursor-pointer", "object-cover", "hover:opacity-80"]) expect(svg).not.toHaveClass(cls);
  });

  it("clips the rings at the edge of the picture so they never spill over what is beside it", () => {
    const { container } = drawn("NO_DATA");
    expect(svgOf(container).parentElement).toHaveClass("overflow-hidden");
  });

  it("draws nothing for an image type it does not know, rather than a broken image", () => {
    const { container } = render(<ImageField images={[{ imageType: "mystery" } as never]} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("draws an illustration alongside other image types", () => {
    const { container } = render(
      <ImageField images={[{ imageType: "illustration", illustration: "NO_DATA" }, { document: "a.png", altText: "A" }]} />
    );
    expect(container.querySelectorAll("svg.sw-illustration-animated")).toHaveLength(1);
    expect(container.querySelectorAll("img")).toHaveLength(1);
  });
});

describe("illustrations - every one is animated", () => {
  // The animation lives in CSS, keyed on these classes, so each picture must carry at least one
  const ANIMATED = ".sw-ill-tile, .sw-ill-centre, .sw-ill-ring, .sw-ill-line, .sw-ill-card, .sw-ill-bar, .sw-ill-dot";

  it.each(ALL)("%s carries animated parts, and none when showAnimation is false", (name) => {
    const on = drawn(name);
    expect(svgOf(on.container)).toHaveClass("sw-illustration-animated");
    expect(on.container.querySelectorAll(ANIMATED).length).toBeGreaterThan(0);
    on.unmount();
    const off = drawn(name, false);
    expect(svgOf(off.container)).not.toHaveClass("sw-illustration-animated");
  });
});

describe("illustrations - animation styles", () => {
  const css = readFileSync(join(process.cwd(), "src/index.css"), "utf8");

  // The classes the drawing puts on its parts only animate if index.css has a rule for each
  it.each(["sw-ill-centre", "sw-ill-ring", "sw-ill-tile", "sw-ill-line", "sw-ill-arrow", "sw-ill-card", "sw-ill-bar", "sw-ill-dot"])(
    "%s has an animation, and one that is switched off for reduced motion",
    (cls) => {
      const rule = new RegExp(`\\.sw-illustration-animated \\.${cls}\\s*\\{[^}]*animation:`);
      expect(css).toMatch(rule);
      const reduced = css.slice(css.indexOf("prefers-reduced-motion: reduce", css.indexOf("sw-ill-centre-in")));
      expect(reduced).toContain(`.sw-illustration-animated .${cls}`);
    }
  );
});

describe("illustrations - specs", () => {
  it("has the pre-baked set", () => {
    expect(Object.keys(ILLUSTRATIONS)).toHaveLength(21);
    expect(STACKS).toHaveLength(6);
  });

  // The drawing indexes a sequence by position, so a sequence that does not line up with the
  // lines and tiles it times would fail only when that picture is drawn
  it.each(RADIAL)("%s has timing for exactly the lines and tiles it draws", (_name, spec) => {
    if (!spec.sequence) return;
    expect(spec.sequence.lines).toHaveLength(spec.lines.length);
    expect(spec.sequence.tiles).toHaveLength(spec.tiles.length);
  });

  it.each(RADIAL)("%s has no two lines drawn the same, which would clash as keys", (_name, spec) => {
    expect(new Set(spec.lines).size).toBe(spec.lines.length);
  });

  // The picture is 400 x 176 around its centre, and the Empty State pattern lays its words out
  // knowing nothing hangs lower than 57 units below the centre
  it.each(RADIAL)("%s keeps every tile inside the picture and clear of the words below", (_name, spec) => {
    for (const tile of spec.tiles) {
      expect(Math.abs(tile.x) + 13).toBeLessThanOrEqual(200);
      expect(tile.y - 13).toBeGreaterThanOrEqual(-88);
      expect(tile.y + 13).toBeLessThanOrEqual(57);
      expect(tile.opacity).toBeGreaterThan(0);
      expect(tile.opacity).toBeLessThanOrEqual(1);
    }
  });

  it.each(RADIAL)("%s draws what its spec says", (name, spec) => {
    const { container } = drawn(name);
    expect(container.querySelectorAll(".sw-ill-tile")).toHaveLength(spec.tiles.length);
    expect(container.querySelectorAll(".sw-ill-line")).toHaveLength(spec.lines.length);
    expect(container.querySelectorAll(".sw-ill-arrow")).toHaveLength(spec.arrows ? spec.lines.length : 0);
    expect(container.querySelectorAll(".sw-ill-ring")).toHaveLength(spec.rings.length);
    expect(container.querySelectorAll(".sw-ill-centre")).toHaveLength(1);
  });

  it("draws the centre in the accent colour for a step and in grey for a general picture", () => {
    const triggers = drawn("TRIGGERS");
    expect(triggers.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-blue-200");
    triggers.unmount();
    const noData = drawn("NO_DATA");
    expect(noData.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-gray-200");
  });

  it.each(["TRIGGERS", "AI_SKILLS"] as IllustrationName[])("plays %s as a sequence: the source first, the targets last", (name) => {
    const { container } = drawn(name);
    const delays = [...container.querySelectorAll<SVGGElement>(".sw-ill-tile")].map((tile) =>
      parseInt(tile.style.animationDelay, 10)
    );
    // Tiles are in the order: source, two targets, two faint outer tiles
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[0]).toBeLessThan(delays[2]);
  });

  it("plays PROCESS_MODELS left to right", () => {
    const { container } = drawn("PROCESS_MODELS");
    const delays = [...container.querySelectorAll<SVGGElement>(".sw-ill-tile")].map((tile) =>
      parseInt(tile.style.animationDelay, 10)
    );
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
  });});

describe("illustrations - users", () => {
  it("draws five rings and a scatter of person tiles round a user-plus tile", () => {
    const { container } = drawn("USERS");
    expect(container.querySelectorAll(".sw-ill-ring")).toHaveLength(5);
    expect(container.querySelectorAll(".sw-ill-tile").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll(".sw-ill-centre")).toHaveLength(1);
    // Some tiles are tinted so they read as different people
    expect(container.querySelectorAll(".sw-ill-tile rect.fill-gray-100").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".sw-ill-tile rect.fill-white").length).toBeGreaterThan(0);
  });

  it("scatters its tiles rather than setting them on a ring or a grid", () => {
    const radii = ILLUSTRATIONS.USERS.kind === "STACK" ? [] : ILLUSTRATIONS.USERS.tiles.map((t) => Math.round(Math.hypot(t.x, t.y) / 8));
    expect(new Set(radii).size).toBeGreaterThan(4);
  });
});

describe("illustrations - lists and conversations", () => {
  it.each(STACKS)("%s keeps every item inside the picture and clear of the words below", (_name, spec) => {
    expect(spec.items.length).toBeGreaterThan(0);
    for (const item of spec.items) {
      // An avatar sits outside its item, up to 16 units beyond a side
      const reach = item.avatar ? 26 : 0;
      expect(item.x - (item.avatar?.side === "START" ? reach : 0)).toBeGreaterThanOrEqual(-200);
      expect(item.x + item.width + (item.avatar?.side === "END" ? reach : 0)).toBeLessThanOrEqual(200);
      expect(item.y).toBeGreaterThanOrEqual(-88);
      expect(item.y + item.height).toBeLessThanOrEqual(57);
      expect(item.opacity).toBeGreaterThan(0);
      expect(item.opacity).toBeLessThanOrEqual(1);
    }
  });

  it.each(STACKS)("%s keeps its lines of text inside the item that holds them", (_name, spec) => {
    for (const item of spec.items) {
      const textStart = item.badge ? 36 : 12;
      const textEnd = item.width - (item.trailingIcon ? 28 : 12);
      for (const bar of item.bars) expect(textStart + bar).toBeLessThanOrEqual(textEnd);
      const textHeight = item.bars.length * 5 + Math.max(item.bars.length - 1, 0) * 6;
      expect(textHeight).toBeLessThanOrEqual(item.height - 8);
      // Every item says something, or is someone typing
      expect(item.bars.length > 0 || item.typing).toBe(true);
    }
  });

  it.each(STACKS)("%s draws one card per item, with no centre tile or connectors", (name, spec) => {
    const { container } = drawn(name);
    expect(container.querySelectorAll(".sw-ill-card")).toHaveLength(spec.items.length);
    expect(container.querySelectorAll(".sw-ill-line, .sw-ill-centre")).toHaveLength(0);
    // Rings and floating tiles only where the picture has them
    expect(container.querySelectorAll(".sw-ill-ring")).toHaveLength(spec.rings?.length ?? 0);
    expect(container.querySelectorAll(".sw-ill-tile")).toHaveLength(spec.tiles?.length ?? 0);
  });

  it.each(STACKS.filter(([, spec]) => spec.tiles))("%s keeps its floating tiles inside the picture, clear of the cards", (_name, spec) => {
    const cards = spec.items;
    for (const tile of spec.tiles!) {
      expect(Math.abs(tile.x) + 13).toBeLessThanOrEqual(200);
      expect(tile.y - 13).toBeGreaterThanOrEqual(-88);
      expect(tile.y + 13).toBeLessThanOrEqual(57);
      for (const card of cards) {
        const apart =
          tile.x + 13 <= card.x || tile.x - 13 >= card.x + card.width || tile.y + 13 <= card.y || tile.y - 13 >= card.y + card.height;
        expect(apart).toBe(true);
      }
    }
  });

  it("gives every card the semi-rounded corners of a tile, in a list or a conversation", () => {
    for (const [, spec] of STACKS) {
      for (const item of spec.items) {
        // The search box is the one pill, the shape of a search field
        if (item.badge?.icon.displayName === "Search") continue;
        expect(item.radius).toBe(4);
      }
    }
  });

  it("colours the cards as the ringed pictures are coloured: grey, with the accent only on the one that matters", () => {
    const { container } = drawn("CONVERSATION");
    const rects = [...container.querySelectorAll<SVGRectElement>(".sw-ill-card > rect:first-child")];
    expect(rects.filter((rect) => rect.classList.contains("stroke-blue-200"))).toHaveLength(1);
    expect(rects.filter((rect) => rect.classList.contains("stroke-gray-200"))).toHaveLength(2);
    // Same white fill as every other tile, not a blue wash
    for (const rect of rects) expect(rect).toHaveClass("fill-white");
  });

  it("settles its items in one after another, from the top", () => {
    const { container } = drawn("TASK_LIST");
    const delays = [...container.querySelectorAll<SVGGElement>(".sw-ill-card")].map((tile) =>
      parseInt(tile.style.animationDelay, 10)
    );
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(delays.length);
  });

  it("shows three dots for someone typing, each pulsing in turn", () => {
    const { container } = drawn("AI_CHAT");
    const dots = [...container.querySelectorAll<SVGCircleElement>("circle.sw-ill-dot")];
    expect(dots).toHaveLength(3);
    const delays = dots.map((dot) => parseInt(dot.style.animationDelay, 10));
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(3);
  });

  it("writes each line of text in after its card has arrived", () => {
    const { container } = drawn("TASK_LIST");
    const cards = [...container.querySelectorAll<SVGGElement>(".sw-ill-card")];
    for (const card of cards) {
      const cardDelay = parseInt(card.style.animationDelay, 10);
      const bars = [...card.querySelectorAll<SVGRectElement>(".sw-ill-bar")].map((bar) => parseInt(bar.style.animationDelay, 10));
      expect(bars.length).toBeGreaterThan(0);
      for (const bar of bars) expect(bar).toBeGreaterThan(cardDelay);
      expect(bars).toEqual([...bars].sort((a, b) => a - b));
    }
  });

  it.each(STACKS)("%s is animated: every card, and every line of text in it, has a delay set", (name) => {
    const { container } = drawn(name);
    const animated = container.querySelectorAll(".sw-ill-card, .sw-ill-bar, .sw-ill-dot");
    expect(animated.length).toBeGreaterThan(0);
    for (const el of animated) expect((el as SVGElement).style.animationDelay).toMatch(/^\d+ms$/);
  });

  it("puts the speaker's avatar on the side the bubble speaks from", () => {
    const { container } = drawn("AI_CHAT");
    const [first, second] = [...container.querySelectorAll<SVGGElement>(".sw-ill-card")];
    const bubbleWidth = (g: SVGGElement) => Number(g.querySelector("rect")!.getAttribute("width"));
    const avatarX = (g: SVGGElement) => Number(g.querySelector("circle")!.getAttribute("cx"));
    // The question is asked from the right, the answer comes from the left
    expect(avatarX(first)).toBeGreaterThan(bubbleWidth(first));
    expect(avatarX(second)).toBeLessThan(0);
  });
});
