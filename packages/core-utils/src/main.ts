import { toHijri } from ".";

console.log("core-utils");
const gregorianDate = new Date(2024, 2, 11); // 2024-03-10
const result = toHijri(gregorianDate);
console.log("result", result);
