import fs from "fs";

// current code: 24.168ms
// stream: 80.414ms
// typical code: 7.585s

console.time();
const fd = fs.openSync("texts/numbers.txt", "w");

const totalSize = 16 * 1024; //16384
let totalBytesWritten = 0;

const buf = Buffer.allocUnsafe(totalSize);

for (let i = 1; i <= 1e5; i++) {
  const numberString = i.toString() + " ";

  // write into the disk when buffer has not that capacity to have that
  if (totalSize - totalBytesWritten < numberString.length) {
    const buffString = buf.toString("utf-8", 0, totalBytesWritten - 1);
    fs.writeSync(fd, buffString);
    totalBytesWritten = 0;
  }

  const bytesWritten = buf.write(numberString, totalBytesWritten);

  // write the number to buffer now from start
  totalBytesWritten += bytesWritten;
}

if (totalBytesWritten) {
  fs.writeSync(fd, buf.toString("utf-8", 0, totalBytesWritten - 1));
}

fs.close(fd);
console.timeEnd();
