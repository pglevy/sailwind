import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Illustration } from "./Illustration";
import type { IllustrationName } from "./Illustration";
import { ILLUSTRATIONS } from "./illustrations";
import type { IllustrationSpec } from "./illustrations";

const svgOf = (container: HTMLElement) => container.querySelector("svg") as SVGSVGElement;

describe("Illustration - accessibility", () => {
  it("is decorative: hidden from assistive technology and not focusable", () => {
    const { container } = render(<Illustration name="TRIGGERS" />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });
});

describe("Illustration - animation", () => {
  it("animates by default", () => {
    const { container } = render(<Illustration name="TEST_CASES" />);
    expect(svgOf(container)).toHaveClass("sw-illustration-animated");
  });

  it("does not animate when showAnimation is false", () => {
    const { container } = render(<Illustration name="TEST_CASES" showAnimation={false} />);
    expect(svgOf(container)).not.toHaveClass("sw-illustration-animated");
  });
});

describe("Illustration - specs", () => {
  // Illustration indexes a sequence by position, so a sequence that does not line up with the
  // lines and tiles it times would fail only when that picture is drawn
  it.each(Object.entries(ILLUSTRATIONS) as [IllustrationName, IllustrationSpec][])(
    "%s has timing for exactly the lines and tiles it draws",
    (_name, spec) => {
      if (!spec.sequence) return;
      expect(spec.sequence.lines).toHaveLength(spec.lines.length);
      expect(spec.sequence.tiles).toHaveLength(spec.tiles.length);
    }
  );

  it.each(Object.entries(ILLUSTRATIONS) as [IllustrationName, IllustrationSpec][])(
    "%s has no two lines drawn the same, which would clash as keys",
    (_name, spec) => {
      expect(new Set(spec.lines).size).toBe(spec.lines.length);
    }
  );
});

describe("Illustration - names", () => {
  it.each([
    ["TEST_CASES", { tiles: 6, lines: 4, arrows: 0, rings: 2 }],
    ["TRIGGERS", { tiles: 5, lines: 3, arrows: 3, rings: 2 }],
    ["HISTORY", { tiles: 8, lines: 0, arrows: 0, rings: 4 }],
    ["NO_DATA", { tiles: 8, lines: 0, arrows: 0, rings: 4 }],
  ] as [IllustrationName, { tiles: number; lines: number; arrows: number; rings: number }][])(
    "draws %s",
    (name, expected) => {
      const { container } = render(<Illustration name={name} />);
      expect(container.querySelectorAll(".sw-ill-tile")).toHaveLength(expected.tiles);
      expect(container.querySelectorAll(".sw-ill-line")).toHaveLength(expected.lines);
      expect(container.querySelectorAll(".sw-ill-arrow")).toHaveLength(expected.arrows);
      expect(container.querySelectorAll(".sw-ill-ring")).toHaveLength(expected.rings);
      expect(container.querySelectorAll(".sw-ill-centre")).toHaveLength(1);
    }
  );

  it("draws the centre in the accent colour for a step and in grey for a general picture", () => {
    const triggers = render(<Illustration name="TRIGGERS" />);
    expect(triggers.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-blue-200");
    triggers.unmount();
    const noData = render(<Illustration name="NO_DATA" />);
    expect(noData.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-gray-200");
  });

  it("plays TRIGGERS as a sequence: the source first, the targets last", () => {
    const { container } = render(<Illustration name="TRIGGERS" />);
    const delays = [...container.querySelectorAll<SVGGElement>(".sw-ill-tile")].map((tile) =>
      parseInt(tile.style.animationDelay, 10)
    );
    // Tiles are in the order: source, two targets, two faint outer tiles
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[0]).toBeLessThan(delays[2]);
  });
});
