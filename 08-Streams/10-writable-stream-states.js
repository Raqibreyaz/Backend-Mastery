import fs from "fs";

const writeStream = fs.createWriteStream("texts/file.txt");

// will not write to disk unless uncorked
writeStream.cork();

writeStream.write("hi");

console.log("stream corked:", writeStream.writableCorked);

writeStream.uncork();

// by default stream is writable
console.log('is writable:',writeStream.writable);

// not guaranteed that all the buffered data is written on disk while ending writable
writeStream.end();

// false as writable ended
console.log("is writable:", writeStream.writable);

// true as writable ended
console.log("stream ended:", writeStream.writableEnded);

// likely false as there maybe some data in buffer being written to disk
console.log("stream finished:", writeStream.writableFinished);
console.log("buffer length:", writeStream.writableLength);

setTimeout(() => {
  console.log('stream finished:',writeStream.writableFinished);
  console.log('buffer length',writeStream.writableLength);
}, 10);
