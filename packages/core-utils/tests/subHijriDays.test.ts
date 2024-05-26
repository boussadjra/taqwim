import { describe, it, expect } from "vitest";
import { subHijriDays } from "../src/lib/subHijriDays";

describe("subHijriDays", () => {
  it("should sub the specified number of days to the given date", () => {
    const date = { hy: 1445, hm: 10, hd: 29 };
    const amount = 58;
    const expectedDate = { hy: 1445, hm: 9, hd: 1 };

    const result = subHijriDays(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should return null if the input date is invalid", () => {
    const date = { hy: 1445, hm: 13, hd: 32 };
    const amount = 10;

    const result = subHijriDays(date, amount);

    expect(result).toBeNull();
  });

  it("should return null if the input date is null", () => {
    const date = null;
    const amount = 10;

    const result = subHijriDays(date, amount);

    expect(result).toBeNull();
  });
});
