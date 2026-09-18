import { memo } from "react";
import { render, screen, renderHook, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { LocaleProvider, useI18n, useLocale } from "./context";
import { KEYS, DEFAULT_LOCALE } from "./keys";
import type { I18nContextValue } from "./types";

// =============================================================================
// Example/unit tests for the i18n React context, provider, and hooks.
// Feature: component-i18n, Task 7.2
// Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 5.5, 9.4, 10.3
//
// These are illustrative example tests (not property tests). They exercise the
// real React layer via @testing-library/react — the no-provider default
// instance, nested nearest-wins resolution, locale-change re-render + direction
// tracking, and unsupported-locale warning + default render.
//
// v1 registry note: SUPPORTED_LOCALES is ['en-us'] only. Every value the
// provider resolves is therefore 'en-us' / 'LTR' (an unsupported prop warns and
// falls back to the default). Where a test would ideally show *distinct* locales
// or an RTL flip, that is impossible with a single supported locale; those tests
// document the limitation and assert the strongest behavior still observable
// (object identity for nearest-wins, re-render occurrence for locale changes).
// =============================================================================

// jsdom has no global `Appian`, so getAppianLocale() returns null and the
// provider resolves from its `locale` prop (then DEFAULT_LOCALE) — see the
// resolution chain in context.tsx.

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("i18n context — no-provider default instance", () => {
  // Requirements 1.2, 1.3, 5.5: outside any LocaleProvider, the hooks return a
  // fully working instance bound to the Default_Locale (never undefined / never
  // an error path).
  it("useI18n() outside any provider returns a working en-us default instance", () => {
    const { result } = renderHook(() => useI18n());

    expect(result.current.locale).toBe("en-us");
    expect(result.current.direction).toBe("LTR");
    // The default-bound translation function actually resolves keys.
    expect(result.current.t(KEYS.buttonLoading)).toBe("loading");
  });

  it("useLocale() outside any provider returns the default locale and direction", () => {
    const { result } = renderHook(() => useLocale());

    expect(result.current).toEqual({ locale: "en-us", direction: "LTR" });
  });
});

describe("i18n context — nested providers resolve to the nearest (Req 1.5)", () => {
  it("consumes the nearest enclosing provider's context value", () => {
    // Each probe captures the exact I18nContextValue object it consumes.
    const captured: Record<string, I18nContextValue> = {};
    function Probe({ id }: { id: string }) {
      const value = useI18n();
      captured[id] = value;
      return <span data-testid={id}>{value.locale}</span>;
    }

    render(
      <LocaleProvider locale="en-US">
        <Probe id="outer" />
        <LocaleProvider locale="en-us">
          <Probe id="inner" />
        </LocaleProvider>
      </LocaleProvider>
    );

    // v1 limitation: "en-US" and "en-us" both normalize to the only supported
    // locale, so distinct *values* across the two providers are not observable.
    expect(captured.outer.locale).toBe("en-us");
    expect(captured.inner.locale).toBe("en-us");

    // Nearest-wins: the inner probe consumes the INNER provider's memoized value
    // object — a different instance from the outer provider's value. If the
    // outer value bled past the inner provider (nearest-wins broken), both
    // probes would read the identical object reference.
    expect(captured.inner).not.toBe(captured.outer);
  });
});

describe("i18n context — locale-change re-render + direction (Req 1.4, 9.4)", () => {
  it("re-renders descendants when the locale prop changes and never retains a stale value", () => {
    // Suppress + observe the fallback warning for the unsupported change target.
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // Record every resolved value the descendant renders with. A memoized probe
    // re-renders ONLY when the context value identity changes, so the length of
    // this log is a faithful signal of context-driven re-renders (Req 1.4).
    const renders: string[] = [];
    const Probe = memo(function Probe() {
      const { locale, direction } = useI18n();
      renders.push(`${locale}:${direction}`);
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="direction">{direction}</span>
        </div>
      );
    });

    const { rerender } = render(
      <LocaleProvider locale="en-us">
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-us");
    expect(screen.getByTestId("direction")).toHaveTextContent("LTR");
    expect(renders).toHaveLength(1);

    // Change the locale prop to a different value: this recomputes the provider
    // memo, producing a new context value identity that re-renders the
    // descendant in the same commit. (v1: 'ar-EG' is unsupported, so it warns
    // and resolves to the default en-us/LTR — an RTL flip is not observable with
    // a single supported locale, documented here.)
    rerender(
      <LocaleProvider locale="ar-EG">
        <Probe />
      </LocaleProvider>
    );

    // The descendant re-rendered in response to the prop change (Req 1.4)...
    expect(renders).toHaveLength(2);
    // ...with the correctly resolved (default) locale/direction (Req 9.4)...
    expect(screen.getByTestId("locale")).toHaveTextContent("en-us");
    expect(screen.getByTestId("direction")).toHaveTextContent("LTR");
    // ...and no descendant ever retained the stale/raw prop value.
    expect(renders).not.toContain("ar-EG:RTL");
    expect(renders).not.toContain("ar-eg:LTR");

    // Re-rendering with the SAME prop does not recompute the value (stable
    // identity) and therefore does not re-render the memoized descendant.
    rerender(
      <LocaleProvider locale="ar-EG">
        <Probe />
      </LocaleProvider>
    );
    expect(renders).toHaveLength(2);
  });
});

describe("i18n context — unsupported locale warns + renders default (Req 1.6, 10.3)", () => {
  it("warns naming the unsupported code, keeps rendering, and resolves the default locale", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    function Probe() {
      const { locale } = useI18n();
      return <span data-testid="probe">{locale}</span>;
    }

    render(
      <LocaleProvider locale="fr-FR">
        <Probe />
        <span data-testid="sibling">rendered</span>
      </LocaleProvider>
    );

    // The component tree is not interrupted — descendants still render.
    expect(screen.getByTestId("sibling")).toHaveTextContent("rendered");
    expect(screen.getByTestId("probe")).toBeInTheDocument();

    // The active locale falls back to the default despite the unsupported prop.
    expect(screen.getByTestId("probe")).toHaveTextContent(DEFAULT_LOCALE);

    // A warning was emitted that identifies the unsupported code (normalized).
    expect(warn).toHaveBeenCalled();
    const namedTheCode = warn.mock.calls.some((args) =>
      args.some((arg) => typeof arg === "string" && arg.includes("fr-fr"))
    );
    expect(namedTheCode).toBe(true);
  });
});
