import { describe, it, expect } from "vitest";
import { addHijriQuarters } from "../src/lib/addHijriQuarters";

describe("addHijriQuarters", () => {
  it("should add 2 quarters to the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 2;
    const expectedDate = { hy: 1446, hm: 3, hd: 1 };

    const result = addHijriQuarters(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should add 4 quarters to the given Hijri date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 4;
    const expectedDate = { hy: 1446, hm: 9, hd: 29 };

    const result = addHijriQuarters(date, amount);

    expect(result).toEqual(expectedDate);
  });
});
