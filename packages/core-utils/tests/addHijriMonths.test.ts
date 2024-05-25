import { describe, it, expect } from "vitest";
import { addHijriMonths } from "../src/lib/addHijriMonths";

describe("addHijriMonths", () => {
  it("should add the specified number of Months to the given date", () => {
    const date = { hy: 1445, hm: 9, hd: 1 };
    const amount = 13;
    const expectedDate = { hy: 1446, hm: 10, hd: 1 };

    const result = addHijriMonths(date, amount);

    expect(result).toEqual(expectedDate);
  });

  it("should add the specified number of Months to the given date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 1;

    const result = addHijriMonths(date, amount);

    expect(result).toEqual({ hy: 1445, hm: 10, hd: 29 });
  });

  it("should add the specified number of Months to the given date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 13;

    const result = addHijriMonths(date, amount);

    expect(result).toEqual({ hy: 1446, hm: 10, hd: 30 });
  });

  it("should add the specified number of Months to the given date and adjust the month over many years", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 27;

    const result = addHijriMonths(date, amount);

    expect(result).toEqual({ hy: 1447, hm: 12, hd: 29 });
  });
  it("should add the specified large number of Months to the given date and adjust the month", () => {
    const date = { hy: 1445, hm: 9, hd: 30 };
    const amount = 100;

    const result = addHijriMonths(date, amount);

    expect(result).toEqual({ hy: 1454, hm: 1, hd: 29 });
  });
});
