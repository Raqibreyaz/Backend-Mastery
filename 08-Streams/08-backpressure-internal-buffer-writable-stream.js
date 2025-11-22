import fs from "fs";

/*

- write() method specifies when there is capacity to write, by returning boolean, stating the stream's internal buffer has not exceeded highWaterMark, so when it returns false means highWaterMark is exceeded and further writing will cause write() to apply "backPressure" on internal buffer

- writableLength: returns current size of internal buffer, it requires sometime to get written to file, so on checking after a while we will find it to be 0

- .onDrain() fired when buffer got emptied on been written to disk

*/

const writeStream = fs.createWriteStream("texts/file.txt", {
  highWaterMark: 4,
});

// this highWaterMark value
console.log(writeStream.writableHighWaterMark);

// how much data loaded to writable buffer
console.log(writeStream.writableLength);

// length reaches 1
let isEmpty = writeStream.write("a");
console.log(writeStream.writableLength);

// length reaches 2
isEmpty = writeStream.write("a");
console.log(writeStream.writableLength);

// length reaches 3
isEmpty = writeStream.write("a");
console.log("isempty:", isEmpty);
console.log(writeStream.writableLength);

// length reaches 4, = highWaterMark
isEmpty = writeStream.write("a");
console.log("isempty:", isEmpty);
console.log(writeStream.writableLength);

// length reaches 5, > highWaterMark
isEmpty = writeStream.write("a");
console.log(writeStream.writableLength);

// all data of buffer got cleared after a while, when written to disk
setTimeout(() => {
  console.log(writeStream.writableLength);
}, 100);

let i = 6;
writeStream.on("drain", () => {
  isEmpty = true;
  for (; i <= 1000 && isEmpty; i++) isEmpty = writeStream.write("a");
});