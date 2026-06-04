import fs from "fs";

// internal buffer size = 10
const readStream = fs.createReadStream("texts/result.txt", {
  highWaterMark: 4,
});

readStream.on("data", (chunk) => {
  console.log("chunk processed", chunk);
});

readStream.on("readable", () => {
  console.log("internal buffer filled");

  // will have value = highWaterMark, as provided
  console.log(readStream.readableLength);

  // will have data of internal buffer
  // and decrease the data length as 1 byte been read
  // causing it to be again filled with 'highWaterMark' bytes
  console.log(readStream.read(1));

  // will have value > highWaterMark
  console.log(readStream.readableLength);
});

// one thing to be noted: file is large but still not whole data processed
// as internal buffer not been emptied and still holds data
/*
internal buffer filled
4
chunk processed <Buffer 69>
<Buffer 69>
3
internal buffer filled
7
chunk processed <Buffer 56>
<Buffer 56>
6
*/
