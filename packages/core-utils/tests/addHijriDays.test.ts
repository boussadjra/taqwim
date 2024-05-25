import { describe, it, expect } from "vitest";
import { addHijriDays } from "../src/lib/addHijriDays";

describe("addHijriDays", () => {
  it("should add the specified number of days to the given date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 75;
    const expectedDate = { hy: 1445, hm: 11, hd: 17 };

    const result = addHijriDays(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should return null if the input date is invalid", () => {
    const date = { hy: 1445, hm: 13, hd: 32 };
    const amount = 10;

    const result = addHijriDays(date, amount);

    expect(result).toBeNull();
  });

  it("should return null if the input date is null", () => {
    const date = null;
    const amount = 10;

    const result = addHijriDays(date, amount);

    expect(result).toBeNull();
  });
});
