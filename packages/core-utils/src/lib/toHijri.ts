import { startOfDay, set, toDate, differenceInDays, parseISO } from "date-fns";
import { hDatesTable, type hDates } from "./hDates";

interface DateObject {
	year: number;
	month: number;
	day: number;
}

export function toHijri(
	date: DateObject | Date,
): { hy: number; hm: number; hd: number } | null;
export function toHijri(
	year: number,
	month: number,
	day: number,
): { hy: number; hm: number; hd: number } | null;
export function toHijri(
	date: string,
): { hy: number; hm: number; hd: number } | null;

/**
 * Converts a Gregorian date to Hijri (Islamic) date.
 * @param dateOrYear - The Gregorian date or year to convert.
 * @param month - The month of the Gregorian date (optional, required if `dateOrYear` is a number).
 * @param day - The day of the Gregorian date (optional, required if `dateOrYear` is a number).
 * @returns An object representing the Hijri date in the format `{ hy: number; hm: number; hd: number }`, or `null` if the conversion fails.
 * @throws {Error} If the input is invalid or the conversion fails.
 */
export function toHijri(
	dateOrYear: DateObject | Date | string | number | null,
	month?: number,
	day?: number,
): { hy: number; hm: number; hd: number } | null {
	let gregorianDate: Date;

	if (dateOrYear === null) {
		throw new Error("Invalid Gregorian date");
	}
	if (typeof dateOrYear === "string") {
		gregorianDate = parseISO(dateOrYear);
	} else if (typeof dateOrYear === "number") {
		if (month === undefined || day === undefined) {
			throw new Error("Invalid arguments");
		}
		gregorianDate = new Date(dateOrYear, month - 1, day);
	} else if (dateOrYear instanceof Date) {
		gregorianDate = dateOrYear;
	} else {
		gregorianDate = new Date(
			dateOrYear.year,
			dateOrYear.month - 1,
			dateOrYear.day,
		);
	}

	if (
		!(gregorianDate instanceof Date) ||
		Number.isNaN(gregorianDate.getTime())
	) {
		throw new Error("Invalid Gregorian date");
	}
	const inputDate = startOfDay(gregorianDate);

	const closestDate = hDatesTable.reduce((prev: Date, curr: hDates) => {
		const currDate = startOfDay(
			set(new Date(), { year: curr.gy, month: curr.gm - 1, date: curr.gd }),
		);
		if (currDate <= inputDate && currDate > prev) {
			return toDate(currDate);
		}
		return prev;
	}, new Date(0));

	const correspondingHijriYear = hDatesTable.find((date: hDates) => {
		const dt = startOfDay(
			set(new Date(), { year: date.gy, month: date.gm - 1, date: date.gd }),
		);
		return toDate(dt).getTime() === closestDate.getTime();
	});

	if (correspondingHijriYear) {
		const _differenceInDays = differenceInDays(
			inputDate,
			startOfDay(closestDate),
		);

		const hijriYear = correspondingHijriYear.hy;
		let hijriMonth = 0;
		let remainingDays = Math.round(_differenceInDays);

		for (let i = 0; i < 12; i++) {
			const daysInThisMonth = (correspondingHijriYear.dpm >> i) & 1 ? 30 : 29;
			if (remainingDays < daysInThisMonth) {
				hijriMonth = i + 1;
				break;
			}
			remainingDays -= daysInThisMonth;
		}

		return { hy: hijriYear, hm: hijriMonth, hd: remainingDays + 1 };
	}

	return null;
}
