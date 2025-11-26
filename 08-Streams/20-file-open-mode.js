import fs from "fs";

// opening in append and read-mode
const fd = fs.openSync("texts/file.txt", "a+");

fs.writeSync(fd, "data");
