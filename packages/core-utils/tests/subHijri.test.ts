import { describe, it, expect } from "vitest";
import { subHijri } from "../src/lib/subHijri";

describe("subHijri", () => {
  it("should subtract 10 days from the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const duration = { years: 0, months: 0, weeks: 0, days: 10 };
    const expectedDate = { hy: 1445, hm: 8, hd: 20 };

    const result = subHijri(date, duration);

    expect(result).toEqual(expectedDate);
  });

  it("should subtract 1 year, 2 months, 3 weeks, and 4 days from the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const duration = { years: 1, months: 2, weeks: 3, days: 4 };
    const expectedDate = { hy: 1444, hm: 6, hd: 5 };

    const result = subHijri(date, duration);

    expect(result).toEqual(expectedDate);
  });
});
