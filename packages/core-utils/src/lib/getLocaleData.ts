import * as localeNamespaces from "./locales";

type LocaleKeys = keyof typeof localeNamespaces;

type LocaleKeysValues = keyof (typeof localeNamespaces)[LocaleKeys];

export const getLocaleData = (
  locale: string,
  key: LocaleKeysValues
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
