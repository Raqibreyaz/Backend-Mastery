import crypto from "node:crypto";
import { readFileSync } from "node:fs";

// const fileData = readFileSync("texts/file.txt");

// const hash = crypto.createHash("sha256").update(fileData);
// console.log(hash.digest("hex"));

const hash = crypto
  .createHash("sha256")
  .update("hello ")
  .update("world")
  .digest("base64url");

console.log(hash);
