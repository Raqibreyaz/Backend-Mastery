import readline from "readline";
import fs from "fs";

// will take input from this file, line by line
const inputFile = fs.createReadStream("User-Input/input.txt");

// will print into this file
const outputFile = fs.createWriteStream("User-Input/output.txt");

const rl = readline.createInterface({
  input: inputFile,
  output: outputFile,
  terminal: false,
});

rl.on("line", (line) => {
  outputFile.write(`Processed: ${line}\n`);
});

rl.on("close", () => {
  console.log("Finished reading file");
});
