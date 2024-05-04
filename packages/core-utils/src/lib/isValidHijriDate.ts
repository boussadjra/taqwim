// utils.ts
import { hDatesTable } from "./hDates";

export function isValidHijriDate(date: {
  hy: number;
  hm: number;
  hd: number;
}): boolean;
export function isValidHijriDate(date: string, separator?: string): boolean;
export function isValidHijriDate(hy: number, hm: number, hd: number): boolean;
/**
 * Checks if a given Hijri date is valid.
 *
 * @param hy - The Hijri year as a number, string, or an object with `hy`, `hm`, and `hd` properties.
 * @param hm - The Hijri month as a number or string. Optional if `hy` is an object.
 * @param hd - The Hijri day as a number. Optional if `hy` is an object.
 * @returns A boolean indicating whether the Hijri date is valid or not.
 */
export function isValidHijriDate(
  hy: number | string | { hy: number; hm: number; hd: number },
  hm?: number | string,
  hd?: number
): boolean {
  if (typeof hy === "string") {
    const dateParts = hy.split((hm as string) || "-").map(Number);
    if (dateParts.length !== 3 || dateParts.some(isNaN)) return false;
    const [year, month, day] = dateParts;

    return isValidHijriDate(year, month, day);
  } else if (typeof hy === "object") {
    return isValidHijriDate(hy.hy, hy.hm, hy.hd);
  } else {
    const yearRecord = hDatesTable.find((record) => record.hy === hy);
    if (!yearRecord) {
      return false;
    }

    const daysInMonth = (yearRecord.dpm >> ((hm as number) - 1)) & 1 ? 30 : 29;
    return (
      (hm as number) >= 1 &&
      (hm as number) <= 12 &&
      hd! >= 1 &&
      hd! <= daysInMonth
    );
  }
}
