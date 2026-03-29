import { randomBytes } from "node:crypto";

const secret = randomBytes(48).toString("hex");
const pepper = randomBytes(32).toString("hex");

console.log("PowerShell:");
console.log(`$env:SECRET="${secret}"`);
console.log(`$env:PEPPER="${pepper}"`);
console.log("");
console.log("Linux/Mac:");
console.log(`export SECRET="${secret}"`);
console.log(`export PEPPER="${pepper}"`);
