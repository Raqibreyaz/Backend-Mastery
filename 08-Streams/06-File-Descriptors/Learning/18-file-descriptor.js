import fs from "fs";

const fd = fs.openSync("texts/file.txt");

const buf = Buffer.allocUnsafe(10);

fs.read(fd, buf, (err, bytes_read, content_buffer) => {
  console.log(content_buffer.toString());
  console.log("bytes read:", bytes_read);
  console.log("buffer length:", content_buffer.byteLength);
  console.log(buf.buffer === content_buffer.buffer);
});
