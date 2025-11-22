import fs from "fs";

const readStream = fs.createReadStream("texts/file.txt", { highWaterMark: 4 });

readStream.setEncoding("utf-8");

readStream.on("open", (fd) => console.log("file opened with fd: ", fd));

readStream.on("data", (chunk) => {
  console.log(chunk);

  // destroy stream, closes the file
  readStream.destroy(new Error("err"));
});

readStream.on("end", () => {
  console.log("stream ended");
});

readStream.on("close", () => {
  console.log("stream closed");
});

// will run when destroy gets an error as parameter
readStream.on("error", (error) => {
  console.log("got error", error);
});
