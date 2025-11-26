import fs from "fs";

const fd = fs.openSync("texts/file.txt", "w");

// byteswritten will not always be equal to given data length
// 😊 takes more bytes
console.log("🚀".length); // length=2 but actually it should be 4
fs.write(fd, "🚀", (err, bytesWritten, writtenData) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(bytesWritten);
  console.log(writtenData);
});
