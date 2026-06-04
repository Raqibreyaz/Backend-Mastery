import fs from "fs/promises";

const srcFile = process.argv[2];
const destFile = process.argv[3];

if (!srcFile) throw new Error("src file is required!");

const content = await fs.readFile(srcFile, "base64");

if (destFile) {
  fs.writeFile(destFile, content, "base64");
} else console.log(content);
