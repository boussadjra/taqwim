import { describe, it, expect } from "vitest";
import { getDaysLengthInMonth } from "../src/lib/getDaysLengthInMonth";

describe("getDaysLengthInMonth", () => {
  it("should return 30 for valid Hijri month with 30 days", () => {
    const hy = 1445;
    const hm = 9;
    const expectedLength = 30;

    const result = getDaysLengthInMonth(hy, hm);

    expect(result).toEqual(expectedLength);
  });

  it("should return 29 for valid Hijri month with 29 days", () => {
    const hy = 1445;
    const hm = 10;
    const expectedLength = 29;

    const result = getDaysLengthInMonth(hy, hm);

    expect(result).toEqual(expectedLength);
  });

  it("should return -1 for invalid Hijri month", () => {
    const hy = 1445;
    const hm = 13;
    const expectedLength = -1;

    const result = getDaysLengthInMonth(hy, hm);

    expect(result).toEqual(expectedLength);
  });

  it("should return -1 for invalid Hijri year", () => {
    const hy = 1200;
    const hm = 9;
    const expectedLength = -1;

    const result = getDaysLengthInMonth(hy, hm);

    expect(result).toEqual(expectedLength);
  });
});
