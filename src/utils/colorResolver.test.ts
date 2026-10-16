import { describe, it, expect } from "vitest";
import {
  contrastRatio,
  getAccessibleTextColor,
  getContrastColor,
} from "./colorResolver";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#2322F0", "#2322F0")).toBeCloseTo(1, 5);
  });

  it("is order independent", () => {
    expect(contrastRatio("#357A38", "#FFFFFF")).toBeCloseTo(
      contrastRatio("#FFFFFF", "#357A38"),
      5
    );
  });
});

describe("getContrastColor", () => {
  it("picks white text on dark fills", () => {
    expect(getContrastColor("#2322F0")).toBe("#ffffff"); // blue-500
    expect(getContrastColor("#357A38")).toBe("#ffffff"); // green-700
  });

  it("picks black text on light fills", () => {
    expect(getContrastColor("#FFD948")).toBe("#000000"); // yellow-500
  });
});

describe("getAccessibleTextColor", () => {
  it("leaves colors that already pass on white unchanged", () => {
    expect(getAccessibleTextColor("#357A38")).toBe("#357a38");
    expect(getAccessibleTextColor("#2322F0")).toBe("#2322f0");
  });

  it("darkens light colors until they pass 4.5:1 on white", () => {
    const yellow = "#FFD948";
    expect(contrastRatio(yellow, "#FFFFFF")).toBeLessThan(4.5);

    const adjusted = getAccessibleTextColor(yellow);
    expect(adjusted).not.toBe(yellow.toLowerCase());
    expect(contrastRatio(adjusted, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("meets the requested ratio for every palette-like input", () => {
    const samples = [
      "#FFD948", "#FFC107", "#7DE208", "#00D4D4", "#E21496",
      "#B561FF", "#BDBDBD", "#FFFFFF", "#03A9F4",
    ];
    samples.forEach((hex) => {
      expect(contrastRatio(getAccessibleTextColor(hex), "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
    });
  });

  it("supports a custom minimum ratio on white", () => {
    const adjusted = getAccessibleTextColor("#FFD948", "#FFFFFF", 7);
    expect(contrastRatio(adjusted, "#FFFFFF")).toBeGreaterThanOrEqual(7);
  });

  it("only shifts as far as needed, landing close to the requested ratio", () => {
    const ratio = contrastRatio(getAccessibleTextColor("#FFD948"), "#FFFFFF");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeLessThan(4.6);
  });

  it("lightens instead of darkening on a dark background", () => {
    const adjusted = getAccessibleTextColor("#555555", "#000000");
    expect(contrastRatio(adjusted, "#000000")).toBeGreaterThanOrEqual(4.5);
    expect(adjusted).not.toBe("#000000");
    // Lighter than where it started
    expect(parseInt(adjusted.slice(1, 3), 16)).toBeGreaterThan(0x55);
  });

  it("meets the requested ratio on a range of dark backgrounds", () => {
    const backgrounds = ["#000000", "#111827", "#1F2937", "#2322F0", "#357A38"];
    const colors = ["#555555", "#2322F0", "#357A38", "#FFD948", "#B561FF"];
    backgrounds.forEach((background) => {
      colors.forEach((color) => {
        expect(contrastRatio(getAccessibleTextColor(color, background), background)).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  it("returns whichever of black and white contrasts more when neither reaches the ratio", () => {
    expect(getAccessibleTextColor("#777777", "#777777", 7)).toBe("#000000");
  });

  it("expands shorthand hex values", () => {
    expect(contrastRatio(getAccessibleTextColor("#ff0"), "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });
});
