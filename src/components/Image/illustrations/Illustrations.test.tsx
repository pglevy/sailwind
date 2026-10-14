import * as React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImageField } from "../ImageField";
import { HistoryIllustration, NoDataIllustration, TestCasesIllustration, TriggersIllustration } from "./index";
import { ILLUSTRATIONS } from "./illustrationSpecs";
import type { IllustrationName, IllustrationSpec } from "./illustrationSpecs";

const svgOf = (container: HTMLElement) => container.querySelector("svg") as SVGSVGElement;

describe("pre-baked illustrations - accessibility", () => {
  it("is decorative: hidden from assistive technology and not focusable", () => {
    const { container } = render(<TriggersIllustration />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });
});

describe("pre-baked illustrations - size and class", () => {
  it("carries its drawn size as its natural size, so a size class or the container can change it", () => {
    const { container } = render(<NoDataIllustration />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("width", "400");
    expect(svg).toHaveAttribute("height", "176");
    expect(svg).toHaveClass("max-w-full");
  });

  it("puts the className it is given on the root svg", () => {
    const { container } = render(<NoDataIllustration className="w-96 custom" />);
    expect(svgOf(container)).toHaveClass("w-96", "custom");
  });
});

describe("pre-baked illustrations - animation", () => {
  it("animates by default", () => {
    const { container } = render(<TestCasesIllustration />);
    expect(svgOf(container)).toHaveClass("sw-illustration-animated");
  });

  it("does not animate when showAnimation is false", () => {
    const { container } = render(<TestCasesIllustration showAnimation={false} />);
    expect(svgOf(container)).not.toHaveClass("sw-illustration-animated");
  });
});

describe("pre-baked illustrations - specs", () => {
  // The drawing indexes a sequence by position, so a sequence that does not line up with the
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

describe("pre-baked illustrations - what each draws", () => {
  const cases: [string, React.FC, { tiles: number; lines: number; arrows: number; rings: number }][] = [
    ["TestCasesIllustration", TestCasesIllustration, { tiles: 6, lines: 4, arrows: 0, rings: 2 }],
    ["TriggersIllustration", TriggersIllustration, { tiles: 5, lines: 3, arrows: 3, rings: 2 }],
    ["HistoryIllustration", HistoryIllustration, { tiles: 8, lines: 0, arrows: 0, rings: 4 }],
    ["NoDataIllustration", NoDataIllustration, { tiles: 8, lines: 0, arrows: 0, rings: 4 }],
  ];

  it.each(cases)("%s", (_name, Illustration, expected) => {
    const { container } = render(<Illustration />);
    expect(container.querySelectorAll(".sw-ill-tile")).toHaveLength(expected.tiles);
    expect(container.querySelectorAll(".sw-ill-line")).toHaveLength(expected.lines);
    expect(container.querySelectorAll(".sw-ill-arrow")).toHaveLength(expected.arrows);
    expect(container.querySelectorAll(".sw-ill-ring")).toHaveLength(expected.rings);
    expect(container.querySelectorAll(".sw-ill-centre")).toHaveLength(1);
  });

  it("draws the centre in the accent colour for a step and in grey for a general picture", () => {
    const triggers = render(<TriggersIllustration />);
    expect(triggers.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-blue-200");
    triggers.unmount();
    const noData = render(<NoDataIllustration />);
    expect(noData.container.querySelector(".sw-ill-centre rect")).toHaveClass("stroke-gray-200");
  });

  it("plays TriggersIllustration as a sequence: the source first, the targets last", () => {
    const { container } = render(<TriggersIllustration />);
    const delays = [...container.querySelectorAll<SVGGElement>(".sw-ill-tile")].map((tile) =>
      parseInt(tile.style.animationDelay, 10)
    );
    // Tiles are in the order: source, two targets, two faint outer tiles
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[0]).toBeLessThan(delays[2]);
  });
});

describe("ImageField - SVG image", () => {
  it("renders a pre-baked illustration as an SVG image, sized by ImageField's size", () => {
    const { container } = render(
      <ImageField images={[{ imageType: "svg", component: NoDataIllustration }]} size="LARGE" />
    );
    expect(svgOf(container)).toHaveClass("w-96");
  });

  it("renders any component given as the reference, passing it the className", () => {
    const Custom: React.FC<{ className?: string }> = ({ className }) => (
      <svg data-testid="custom" className={className} viewBox="0 0 10 10">
        <circle r="4" cx="5" cy="5" />
      </svg>
    );
    const { getByTestId } = render(<ImageField images={[{ imageType: "svg", component: Custom }]} size="ICON_PLUS" />);
    expect(getByTestId("custom")).toHaveClass("w-10", "h-10");
  });

  it("passes componentProps to the component", () => {
    const { container } = render(
      <ImageField
        images={[{ imageType: "svg", component: TestCasesIllustration, componentProps: { showAnimation: false } }]}
      />
    );
    expect(svgOf(container)).not.toHaveClass("sw-illustration-animated");
  });

  it("hides a decorative SVG image from assistive technology", () => {
    const { container } = render(<ImageField images={[{ imageType: "svg", component: NoDataIllustration }]} />);
    expect(container.querySelector("[aria-hidden='true']")).toContainElement(svgOf(container));
  });

  it("names an SVG image that has altText", () => {
    const { getByRole } = render(
      <ImageField images={[{ imageType: "svg", component: NoDataIllustration, altText: "Nothing to show" }]} />
    );
    expect(getByRole("img", { name: "Nothing to show" })).toBeInTheDocument();
  });

  it("does not draw an SVG image whose showWhen is false", () => {
    const { container } = render(
      <ImageField images={[{ imageType: "svg", component: NoDataIllustration, showWhen: false }]} />
    );
    expect(container.querySelector("svg")).toBeNull();
  });

  it("makes a linked SVG image a keyboard-operable button", () => {
    let opened = 0;
    const { getByRole } = render(
      <ImageField
        images={[{ imageType: "svg", component: NoDataIllustration, altText: "Open the list", link: () => opened++ }]}
      />
    );
    const button = getByRole("button", { name: "Open the list" });
    button.focus();
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    button.click();
    expect(opened).toBe(2);
  });
});
