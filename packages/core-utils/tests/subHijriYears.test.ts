import { describe, it, expect } from "vitest";
import { subHijriYears } from "../src/lib/subHijriYears";

describe("subHijriYears", () => {
  it("should subtract 10 years from the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 10;
    const expectedDate = { hy: 1435, hm: 9, hd: 1 };

    const result = subHijriYears(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should subtract 1 year from the given Hijri date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 1;
    const expectedDate = { hy: 1444, hm: 9, hd: 29 };

    const result = subHijriYears(date, amount);

    expect(result).toEqual(expectedDate);
  });
});
