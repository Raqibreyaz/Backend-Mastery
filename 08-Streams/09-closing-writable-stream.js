import fs from "fs";

const writeStream = fs.createWriteStream("texts/file.txt");

writeStream.write("a");
writeStream.write("b");

// required to close the stream, as it is not done on its own like readStream
writeStream.end("hi i am raquib");

writeStream.on("close", () => console.log("writing closed"));
writeStream.on("finish", () => console.log("writing finished"));
/*
writing finished
writing closed
*/
