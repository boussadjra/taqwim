import { describe, it, expect } from "vitest";
import { addHijriYears } from "../src/lib/addHijriYears";

describe("addHijriYears", () => {
  it("should add the specified number of Years to the given date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 10;
    const expectedDate = { hy: 1455, hm: 9, hd: 1 };

    const result = addHijriYears(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should add the specified number of Years to the given date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 1;

    const result = addHijriYears(date, amount);

    expect(result).toEqual({ hy: 1446, hm: 9, hd: 29 });
  });
});
