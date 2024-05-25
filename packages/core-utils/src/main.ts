import { addHijriMonths, toGregorian } from "./lib";

const date = { hy: 1445, hm: 9, hd: 30 };

console.log(addHijriMonths(date, 100));
console.log(toGregorian({ hy: 1454, hm: 1, hd: 29 }));
console.log(toGregorian(addHijriMonths(date, 100)));
