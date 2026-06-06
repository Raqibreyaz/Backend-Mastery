// metrics
/*

file size: 1259138815 bytes

synchronous: 2.612s
asynchronous(await): 506.502ms

*/

import fs from "fs/promises";
// import fs from "fs";

let val = 0;

// timer start
console.time();

const interval = setInterval(() => {
  console.log(val++);

  if (val == 100) {
    clearInterval(interval);

    // timer ends
    console.timeEnd();
  }
}, 5);

// fs.readFileSync("sample.txt");
await fs.readFile("sample.txt");
console.log("file read done");

fs.stat("sample.txt").then((st) => console.log(st));
fs.statfs("sample.txt").then((st) => console.log(st));
