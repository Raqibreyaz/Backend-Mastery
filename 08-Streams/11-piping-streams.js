import fs from "fs";

const readStream = fs.createReadStream(
  "/mnt/data1/Videos/Ritik Prasad - 🔴 React Native Crash Course _26 Roadmap ｜ Basic To...mp4"
);
const writeStream = fs.createWriteStream("texts/file.mp4");

writeStream.on("pipe", (rstream) => {
  console.log("writing piped");
});

// transfer data to writeStream
// implicitly calls writeStream.end()
readStream.pipe(writeStream);

writeStream.on("unpipe", (rstream) => {
  console.log("writing unpiped");
});

// stop writing to stream after 1s
setTimeout(() => {
  readStream.unpipe(writeStream);
  writeStream.end();
}, 1000);

