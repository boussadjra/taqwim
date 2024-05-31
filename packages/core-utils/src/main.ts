import { addHijriMonths, formatHijriDate } from "./lib";

const hijriDate = { hy: 1445, hm: 9, hd: 1 };
const formatStr = " dd MMMM, yyyy ";
const locale = "en";
const expectedFormattedDate = "1 Ramadan, 1445 (2 April, 2024)";

const formattedDate = formatHijriDate(hijriDate, formatStr, locale);

console.log(formattedDate);
