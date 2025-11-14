import fs from "fs/promises";

const datab64 = await fs.readFile("texts/favicon-16x16.png", "base64");

await fs.writeFile("texts/result.txt", datab64);

const b64data = await fs.readFile("texts/result.txt", "utf-8");

// since data is binary so we have to encode using base-64 while writing to get it back
fs.writeFile("texts/result.png", b64data, { encoding: "base64" });



const datab64url = await fs.readFile("texts/favicon-16x16.png", "base64url");

await fs.writeFile("texts/result.txt", datab64url);

const b64urldata = await fs.readFile("texts/result.txt", "utf-8");

// since data is binary so we have to encode using base-64 while writing to get it back
fs.writeFile("texts/result.png", b64urldata, { encoding: "base64url" });
