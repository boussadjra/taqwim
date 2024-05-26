import { describe, it, expect } from "vitest";
import { subHijriQuarters } from "../src/lib/subHijriQuarters";

describe("subHijriQuarters", () => {
  it("should substract 2 quarters from the given Hijri date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 2;
    const expectedDate = { hy: 1445, hm: 3, hd: 1 };

    const result = subHijriQuarters(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should substract 4 quarters from the given Hijri date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 4;
    const expectedDate = { hy: 1444, hm: 9, hd: 29 };

    const result = subHijriQuarters(date, amount);

    expect(result).toEqual(expectedDate);
  });
});
