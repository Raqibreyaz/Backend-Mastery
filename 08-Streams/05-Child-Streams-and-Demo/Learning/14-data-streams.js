import fs from "fs";
import { spawn } from "child_process";
/*

- stdin: duplex stream, usually used as readable stream
- stdout: duplex stream, usually used as writable stream
- stderr: duplex stream, usually used as writable stream

*/

// console.log(process.stdin);
// console.log(process.stdout);
// console.log(process.stderr);

// process.stdin.on("data", (data) => console.log("data received:", data));

// usually gives error, but dont know why it worked and printed like stdout
// process.stdin.write("data\n");

// const writeStream = fs.createWriteStream("texts/file.txt");

// process.stdin.pipe(writeStream);

const child_process = spawn("node", ["08-Streams/14-child-stream.js"]);

// will be infinite loop
// child_process.stdout.on("data", (chunk) => child_process.stdin.write(chunk));

child_process.stdout.on("data", (chunk) => console.log(chunk));

// passes this to child's stdin listener
child_process.stdin.write("writing to child's input: new data\n");

// will not work
process.stdout.on("data", (chunk) =>
  process.stdout.write(`data received ${chunk}\n`)
);
