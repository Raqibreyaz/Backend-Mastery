import fs from "fs";
import {
  pipeline,
  Readable,
  Writable,
  Duplex,
  Transform,
  PassThrough,
} from "stream";

const readStream = fs.createReadStream(
  "/mnt/data1/Videos/Ritik Prasad - 🔴 React Native Crash Course _26 Roadmap ｜ Basic To...mp4"
);
const writeStream = fs.createWriteStream("texts/file.mp4");

// readStream.pipe(writeStream);
// readStream.on("error", (error) => console.error(error));
pipeline(readStream, writeStream, (error) => console.error(error));

// stop writing to stream after 1s
setTimeout(() => {
  writeStream.destroy("Error");
}, 1000);
