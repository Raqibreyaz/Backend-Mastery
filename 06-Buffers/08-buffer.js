import { Buffer } from "node:buffer";

const a = new ArrayBuffer(4);
// const nodeBuffer = Buffer.alloc(4);
const nodeBuffer = Buffer.from(a);
const uint8arr = new Uint8Array(a);

uint8arr[0] = 97;
uint8arr[1] = 98;
uint8arr[2] = 99;
uint8arr[3] = 100;

console.log(nodeBuffer);
console.log(uint8arr);
console.log(nodeBuffer.toString("utf-16le"));
console.log(uint8arr.toString());
/*
    <Buffer 61 62 63 64>
    Uint8Array(4) [ 97, 98, 99, 100 ]
    abcd
    97,98,99,100
*/

const buf = Buffer.alloc(4);
const buf1 = Buffer.from(["a", "b", "v", "z"]);

console.log(buf.buffer.byteLength);
console.log(buf1.buffer.byteLength);
console.log(buf.byteLength);
console.log(buf1.byteLength);
/*
4
8192
4
4
*/