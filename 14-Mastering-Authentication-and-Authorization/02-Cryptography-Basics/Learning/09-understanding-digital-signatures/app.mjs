import fs from "fs";
import crypto from "node:crypto";

const fileData = fs.readFileSync("./loan-agreement.md");
const secretKey = "my-super-secret-key";

const hash = crypto
  .createHash("sha256")
  .update(fileData)
  .update(secretKey)
  .digest("hex");
  
console.log(hash);
