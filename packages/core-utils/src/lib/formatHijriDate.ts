import { format, getDay, set } from "date-fns";
import { getLocaleData, toGregorian } from ".";
import { availablelocales } from "./locales/availableLocales";
/**
 * Formats a Hijri date based on the provided format string.
 * @param hijriDate - The Hijri date object containing the year, month, and day.
 * @param formatStr - The format string specifying how the Hijri date should be formatted.
 * @param locale - The locale to use for formatting the date. Defaults to "en".
 * @returns The formatted Hijri date as a string.
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iYYYY/iMM/iDD", "ar");
 * //=> "1443/03/10"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "en");
 * //=> "10 Rabiʻ II, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iEEEE, iD iMMMM iYYYY", "ar");
 * //=> "الأحد, 10 جمادى الثاني 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iE, iD iMMM iYYYY", "en");
 * //=> "7, 10 Rabiʻ II 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "fr");
 * //=> "10 Rabiʻ II, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "ar");
 * //=> "10 ربيع الثاني, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "en");
 * //=> "10 Rabiʻ II, 1443"
 */
export function formatHijriDate(
  hijriDate: { hy: number; hm: number; hd: number },
  formatStr: string,
  locale = "en"
): string {
  const hmMedium = getLocaleData(locale, "monthsMedium");
  const hmLong = getLocaleData(locale, "monthsLong");
  const hwShort = getLocaleData(locale, "weekDaysShort");
  const hwLong = getLocaleData(locale, "weekDaysLong");
  const hwNumeric = [1, 2, 3, 4, 5, 6, 7];
  const gregorianDate = toGregorian(hijriDate);

  if (!Object.prototype.hasOwnProperty.call(availablelocales, locale)) {
    throw new Error(`The locale "${locale}" is not supported.`);
  }

  return formatStr.replace(
    /\biYYYY\b|\biYY\b|\biMM\b|\biM\b|\biMMM\b|\biMMMM\b|\biDD\b|\biD\b|\biE\b|\biEEE\b|\biEEEE\b|\byyyy\b|\byy\b|\bMM\b|\bM\b|\bMMM\b|\bMMMM\b|\bdd\b|\bd\b|\bE\b|\bEEE\b|\bEEEE\b|\b[HHhmsaiozZ]+\b/g,
    (match) => {
      const simulatedGregDate = set(new Date(), {
        year: hijriDate.hy,
        month: hijriDate.hm - 1,
        date: hijriDate.hd,
      });

      switch (match) {
        case "iYYYY":
          return String(hijriDate.hy).padStart(4, "0");
        case "iYY":
          return String(hijriDate.hy % 100).padStart(2, "0");
        case "iMM":
          return String(hijriDate.hm).padStart(2, "0");
        case "iM":
          return String(hijriDate.hm);
        case "iMMM":
          return hmMedium[hijriDate.hm - 1];
        case "iMMMM":
          return hmLong[hijriDate.hm - 1];
        case "iDD":
          return String(hijriDate.hd).padStart(2, "0");
        case "iD":
          return String(hijriDate.hd);
        case "iE":
          return String(hwNumeric[getDay(simulatedGregDate)]);
        case "iEEE":
          return hwShort[getDay(simulatedGregDate)];
        case "iEEEE":
          return hwLong[getDay(simulatedGregDate)];

        // the following patterns are the same for Gregorian only
        case "yyyy":
        case "yy":
        case "MM":
        case "M":
        case "MMM":
        case "MMMM":
        case "dd":
        case "d":
        case "E":
        case "EEE":
        case "EEEE":
          // get the corresponding Gregorian date
          console.log(gregorianDate);
          if (!gregorianDate) return "";
          return format(gregorianDate, match, {
            locale: availablelocales[locale],
          });

        // The following patterns are the same for both Gregorian and Hijri
        case "HH":
        case "H":
        case "hh":
        case "h":
        case "mm":
        case "m":
        case "ss":
        case "s":
        case "a":
        case "iooo":
        case "ioooo":
        case "z":
        case "zz":
        case "Z":
          return format(simulatedGregDate, match);
        default:
          return match;
      }
    }
  );
}
