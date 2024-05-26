import { describe, it, expect } from "vitest";
import { subHijriBusinessDays } from "../src/lib/subHijriBusinessDays";

describe("subHijriBusinessDays", () => {
  it("should substract the specified number of business days from the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 10;
    const expectedDate = { hy: 1445, hm: 8, hd: 16 };

    const result = subHijriBusinessDays(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should return null if the given Hijri date is invalid", () => {
    const date = { hy: 1445, hm: 13, hd: 1 };
    const amount = 5;

    const result = subHijriBusinessDays(date, amount);

    expect(result).toBeNull();
  });
});
