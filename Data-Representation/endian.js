import fs from "fs/promises";

const data = await fs.readFile("texts/text.txt");
console.log(data.toString("utf-16le"));
