import fs from "fs/promises";

const contentBuffer = await fs.readFile("text.txt");

contentBuffer.forEach((element) =>
  console.log(Function(`return "\\x${element.toString(16)}"`)())
);

// [0x50, 0x55, 0x67].forEach((element) =>
//   console.log(Function(`return "\\x${element.toString(16)}"`)())
// );
