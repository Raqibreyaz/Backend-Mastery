import fs from "fs";

// default: 7.585s
// console.time();
// for (let i = 0; i <= 100000; i++) {
//   if (i == 0) fs.writeFileSync("texts/numbers.txt", `${i}`);
//   else fs.appendFileSync("texts/numbers.txt", `,${i}`);
// }
// console.timeEnd();

// default: 80.414ms
const writeStream = fs.createWriteStream("texts/numbers.txt");
console.time();
for (let i = 0; i <= 100000; i++) {
  writeStream.write(`${i} `);
}
writeStream.on("finish", console.timeEnd);

writeStream.close();
