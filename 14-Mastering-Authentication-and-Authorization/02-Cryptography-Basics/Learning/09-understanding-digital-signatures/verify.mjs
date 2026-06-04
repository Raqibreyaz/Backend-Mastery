import fs from "fs";
import crypto from "node:crypto";

const fileData = fs.readFileSync("./loan-agreement-signed.md", "utf-8");
const secretKey = "my-super-secret-key";
const [content, signature] = fileData.split("हस्ताक्षर:-");

const hash = crypto
  .createHash("sha256")
  .update(content + "हस्ताक्षर:-")
  .update(secretKey)
  .digest("hex");

if (hash === signature) console.log("data is same!");
else console.log("data altered!");
