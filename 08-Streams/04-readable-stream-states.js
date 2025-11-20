import fs from "fs";

const readStream = fs.createReadStream("texts/result.txt", {
  highWaterMark: 4,
});

readStream.on("ready", () => fs.writeFileSync("texts/file.txt", ""));

readStream.on("data", (chunk) => {
  // null -> initial state
  // then boolean
  // console.log(readStream.readableFlowing);

  // shuru hi ni hui to end kaise hogi
  // console.log(readStream.readableEnded);

  // bytes read so far
  console.log(readStream.bytesRead);

  // shuru hi nhi hui to pause kaise hogi
  // console.log(readStream.isPaused());
  /*
true
false
false
*/

  fs.appendFileSync("texts/file.txt", chunk);
  readStream.pause();

  setTimeout(() => {
    readStream.resume();
  }, 100);
});

readStream.on("end", () => {
  // this returns true even after end!
  console.log(readStream.readableFlowing);
  console.log(readStream.readableEnded);
  console.log(readStream.isPaused());
  /*
true
true
false
*/
});

// even on initial chunk, this resume runs but not for pause
readStream.on("resume", () => console.log("stream resumed"));

readStream.on("pause", () => console.log("stream paused"));
