import { describe, it, expect } from "vitest";
import { toHijri } from "../src/lib/toHijri";

describe("toHijri", () => {
  it("should convert a valid Gregorian date to a valid Hijri date", () => {
    const gregorianDate = new Date(2024, 2, 11); // 2024-03-10
    const result = toHijri(gregorianDate);
    console.log("result", result);
    expect(result).toEqual({ hy: 1445, hm: 9, hd: 1 });
  });

  it("should throw an error for an invalid Gregorian date", () => {
    const gregorianDate = "2022-01-01"; // valid string date
    const result = toHijri(gregorianDate);
    expect(result).toEqual({ hy: 1443, hm: 5, hd: 28 });
  });

  it("should throw an error for a date null", () => {
    const gregorianDate = null; // Invalid date object
    expect(() => {
      toHijri(gregorianDate);
    }).toThrow("Invalid Gregorian date");
  });
});
