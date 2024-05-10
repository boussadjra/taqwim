import * as localeNamespaces from "./locales";

type LocaleKeys = keyof typeof localeNamespaces;

type LocaleKeysValues = keyof (typeof localeNamespaces)[LocaleKeys]; // "monthsLong" | "monthsMedium" | "monthsShort" | "weekDaysLong" | "weekDaysMedium" | "weekDaysShort" | "today" | "day" | "week" | "month" | "year" | "from" | "to"

/**
 * Retrieves the locale data based on the specified locale and key.
 * @param locale - The locale for which to retrieve the data.
 * @param key - The key indicating the specific data to retrieve.
 * @returns The locale data as an array of strings or a single string.
 */
export const getLocaleData = (
	locale: string,
	key: LocaleKeysValues,
): string[] | string => {
	switch (locale) {
		case "ar":
			return localeNamespaces.Arabic[key];
		case "fr":
			return localeNamespaces.French[key];
		default:
			return localeNamespaces.English[key];
	}
};
