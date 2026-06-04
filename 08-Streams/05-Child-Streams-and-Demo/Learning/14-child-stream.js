import fs from "fs";

process.stdin.on("data", (data) =>
  fs.writeFileSync("texts/file.txt", data.toString())
);

process.stdout.write("child data")