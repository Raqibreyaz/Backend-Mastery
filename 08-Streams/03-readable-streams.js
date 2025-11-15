import fs from "fs";

/*
size: 1.1 GiB
Memory: 1.1 GiB
CPU: 9.1%
time: 10s
*/
// console.time();
// const content = await fs.readFile(
//   "/mnt/data1/Videos/Ritik Prasad - ☎️ Truecaller ： Full Stack React Native ｜ Kotlin ...mp4"
// );

// await fs.writeFile("video.mp4", content);
// console.timeEnd();

/*
size: 2.1 GiB
Time: 25s
Memory: 40MiB
CPU: 4.4%
*/

console.time();

const path =
  "/mnt/data1/my-files/JAVA/SnapSave.io-Android Development Tutorial For Beginners In Hindi (With Notes) ��-(1080p).mp4";

const { size: fileSize } = fs.statSync(path);
const chunkSize = 100 * 1024 * 1024; //10MiB
const noOfChunks = Math.ceil(fileSize / chunkSize);
let chunkCount = 0;

const readStream = fs.createReadStream(
  path,
  // 10MiB chunks to read
  { highWaterMark: chunkSize }
);

readStream.on("data", (chunkBuffer) => {
  fs.appendFileSync("video.mp4", chunkBuffer);
  chunkCount++;
  process.stdout.write(`\r${(chunkCount / noOfChunks) * 100}%`);
});

readStream.on("end", () => {
  console.log();
  console.timeEnd();
});
