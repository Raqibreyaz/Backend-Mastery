import fs from "node:fs/promises";

const fileHandle = await fs.open("texts/file.txt", "w+");
const contentBuffer = await fileHandle.read();
console.log(contentBuffer);

const { buffer, bytesWritten } = await fileHandle.write("abcedf");
console.log(buffer);
console.log(bytesWritten);

fileHandle.close();
