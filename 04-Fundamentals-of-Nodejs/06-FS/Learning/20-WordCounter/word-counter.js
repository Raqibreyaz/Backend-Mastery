#!/usr/bin/env node

import fs from "fs/promises";

if (process.argv.length < 3) {
  throw new Error("provide file name");
}

const content = await fs.readFile(process.argv[2], "utf-8");

let word = "";
const ans = {};

for (let i = 0; i < content.length; i++) {
  const lc = content[i].toLowerCase();
  if (lc >= "a" && lc <= "z") {
    word += lc;
  } else if (word) {
    if (!ans[word]) ans[word] = 0;
    ans[word]++;
    word = "";
  }
}

if (!process.argv[3]) {
  console.log(ans);
  console.log("total unique words", Object.keys(ans).length);
} else {
  console.log(`'${process.argv[3]}'`, "Occured", ans[process.argv[3]], "times");
}
