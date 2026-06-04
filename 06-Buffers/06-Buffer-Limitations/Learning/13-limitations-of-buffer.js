import fs from "fs/promises";

// whole file will be loaded at once, can cause the ram to be exhausted
const dataBuffer = await fs.readFile("large-file.txt");
