import fs from "fs/promises";

// buffer content
const contentBuffer = await fs.readFile("text.txt");

// convert into binary number with string
let content = "";
contentBuffer.forEach((element) => {
  content = content + element.toString(2) + " ";
});

console.log(content);
console.dir(contentBuffer);
