import fs from "node:fs/promises";

const readHandle = await fs.open(
  "/mnt/data1/Videos/Ritik Prasad - 🔴 React Native Crash Course _26 Roadmap ｜ Basic To...mp4"
);
const writeHandle = await fs.open("texts/file.mp4", "w");

const readStream = readHandle.createReadStream();
const writeStream = writeHandle.createWriteStream();

readStream.pipe(writeStream);