import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

const secretKey = "my-super-secret-key";
const fileData = await readFile("texts/file.txt", "utf-8");

const simpleHmac = crypto
  .createHash("sha256")
  .update(fileData)
  .update(secretKey)
  .digest("hex");

const hmac = crypto
  .createHmac("sha256", secretKey)
  .update(fileData)
  .digest("hex");

console.log(simpleHmac);
console.log(hmac);
