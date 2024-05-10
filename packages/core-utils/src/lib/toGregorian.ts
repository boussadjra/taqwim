import { set, addDays, toDate } from "date-fns";
import { hDatesTable, isValidHijriDate } from ".";

interface HijriDateObject {
	hy: number;
	hm: number;
	hd: number;
}

export function toGregorian(date: HijriDateObject): Date | null;
export function toGregorian(hy: number, hm: number, hd: number): Date | null;
/**
 * Converts a Hijri date to a Gregorian date.
 * @param dateOrHy - The Hijri date object or the Hijri year.
 * @param hm - The Hijri month (optional, required if `dateOrHy` is a number).
 * @param hd - The Hijri day (optional, required if `dateOrHy` is a number).
 * @returns The corresponding Gregorian date, or `null` if the Hijri date is invalid.
 * @throws Error if the arguments are invalid or the Hijri date is invalid.
 */
export function toGregorian(
	dateOrHy: HijriDateObject | number,
	hm?: number,
	hd?: number,
): Date | null {
	let hijriYear: number;
	let hijriMonth: number;
	let hijriDay: number;

	if (typeof dateOrHy === "number") {
		if (hm === undefined || hd === undefined) {
			throw new Error("Invalid arguments");
		}
		hijriYear = dateOrHy;
		hijriMonth = hm;
		hijriDay = hd;
	} else {
		hijriYear = dateOrHy.hy;
		hijriMonth = dateOrHy.hm;
		hijriDay = dateOrHy.hd;
	}

	//validate hijri date
	if (!isValidHijriDate(hijriYear, hijriMonth, hijriDay)) {
		throw new Error("Invalid Hijri date");
	}

	const hijriYearRecord = hDatesTable.find((record) => record.hy === hijriYear);

	if (hijriYearRecord) {
		let totalDaysTillMonthStart = 0;
		for (let i = 0; i < hijriMonth - 1; i++) {
			totalDaysTillMonthStart += (hijriYearRecord.dpm >> i) & 1 ? 30 : 29;
		}

		const totalDays = totalDaysTillMonthStart + hijriDay - 1;

		const startDate = set(new Date(), {
			year: hijriYearRecord.gy,
			month: hijriYearRecord.gm - 1,
			date: hijriYearRecord.gd,
		});
		const gregorianDate = addDays(startDate, totalDays);

		return toDate(gregorianDate);
	}

	return null;
}
