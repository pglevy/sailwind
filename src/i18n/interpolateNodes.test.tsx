import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { interpolateNodes } from "./interpolateNodes";

describe("interpolateNodes", () => {
  it("substitutes a single placeholder with a plain string argument", () => {
    const { container } = render(<span>{interpolateNodes("Hello {0}!", ["world"])}</span>);
    expect(container.textContent).toBe("Hello world!");
  });

  it("substitutes multiple placeholders positionally", () => {
    const { container } = render(<span>{interpolateNodes("{0} of {1}", ["1 \u2013 10", 100])}</span>);
    expect(container.textContent).toBe("1 \u2013 10 of 100");
  });

  it("leaves a placeholder unchanged when its argument is missing (out of bounds)", () => {
    const { container } = render(<span>{interpolateNodes("{0} of {1}", ["1 \u2013 10"])}</span>);
    expect(container.textContent).toBe("1 \u2013 10 of {1}");
  });

  it("leaves a placeholder unchanged when its argument is undefined", () => {
    const { container } = render(<span>{interpolateNodes("{0} of {1}", ["1 \u2013 10", undefined])}</span>);
    expect(container.textContent).toBe("1 \u2013 10 of {1}");
  });

  it("substitutes a React node argument and preserves its element structure", () => {
    const bold = <span className="font-bold">{"1 \u2013 10"}</span>;
    const { container } = render(<span>{interpolateNodes("{0} of {1}", [bold, 100])}</span>);

    const boldEl = container.querySelector(".font-bold");
    expect(boldEl).not.toBeNull();
    expect(boldEl?.textContent).toBe("1 \u2013 10");
    expect(container.textContent).toBe("1 \u2013 10 of 100");
  });

  it("returns a template with no placeholders unchanged", () => {
    const { container } = render(<span>{interpolateNodes("no placeholders here", ["unused"])}</span>);
    expect(container.textContent).toBe("no placeholders here");
  });
});
