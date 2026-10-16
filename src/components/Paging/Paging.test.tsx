import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Paging } from "./Paging";

describe("Paging - number range bold rendering", () => {
  it("renders '1 – 10 of 100' with '1 – 10' bold for ROW_COUNT (no LocaleProvider / en-us)", () => {
    const { container } = render(
      <Paging
        totalCount={100}
        pageSize={10}
        currentPage={1}
        onPageChange={() => {}}
        pagingControls="ROW_COUNT"
      />
    );

    // The range text is split across the bold span + a trailing text node, so
    // assert on the combined text content (real en dash, U+2013) rather than a
    // single text node via getByText.
    const rangeSpan = container.querySelector("span > span.font-bold")?.parentElement;
    expect(rangeSpan?.textContent).toBe("1 \u2013 10 of 100");

    const bold = document.querySelector(".font-bold");
    expect(bold).not.toBeNull();
    expect(bold?.textContent).toBe("1 \u2013 10");

    // " of 100" must be present but NOT inside the bold element.
    expect(bold?.textContent).not.toContain("of 100");
  });

  it("renders '1 – 10 of many' with '1 – 10' bold for STANDARD (no LocaleProvider / en-us)", () => {
    const { container } = render(
      <Paging
        totalCount={100}
        pageSize={10}
        currentPage={1}
        onPageChange={() => {}}
        pagingControls="STANDARD"
      />
    );

    const rangeSpan = container.querySelector("span > span.font-bold")?.parentElement;
    expect(rangeSpan?.textContent).toBe("1 \u2013 10 of many");

    const bold = document.querySelector(".font-bold");
    expect(bold).not.toBeNull();
    expect(bold?.textContent).toBe("1 \u2013 10");
    expect(bold?.textContent).not.toContain("of many");
  });
});
