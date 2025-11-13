import fs from "fs/promises";
import { Buffer, constants } from "node:buffer";

const nodeBuffer = Buffer.from("Hello World!", "utf-16le");

console.log(nodeBuffer);
/* <Buffer 48 00 65 00 6c 00 6c 00 6f 00 20 00 57 00 6f 00 72 00 6c 00 64 00 21 00> */

// toString() skips 0s while printing
console.log(nodeBuffer.toString("utf-8"));
/* Hello World! */

// but writing to files, all data written as it is with 0s
fs.writeFile("texts/file.txt", nodeBuffer);
/* in opening with utf-8 it will show the 0s as nulls */

// both are same, binary is an alias of latin1
// almost similary to ascii result
console.log(nodeBuffer.toString("binary"));
console.log(nodeBuffer.toString("latin1"));

const bf = Buffer.alloc(8);

// writing to buffer explicitly
bf.write("hello world", "utf-8");

// returns json supported representation, later can be used to send as json
console.log(bf.toJSON());

// returns copy from start to end
// both are same
console.log(bf.slice(0, 5));
console.log(bf.subarray(0, 5));

const bf2 = Buffer.alloc(8);

// start writing from 0 in target, from 0,5 of src
bf.copy(bf2, 0, 0, 5);

console.log(bf2.toString());

console.log(bf.includes("wo"));

// returns decimal value of the 0th index value
console.log(bf.readInt8());

// returns decimal value of the first 2bytes in little endian
console.log(bf.readInt16LE());

// writes the number at 'index' will take 2 bytes due to int16
bf2.writeInt16LE(0x124, 2);
bf2.writeInt16BE(0x124, 4);

console.log(bf2)

// swaps bytes order, little-endian to big-endian or vice versa
bf2.swap16()
bf2.swap32()
