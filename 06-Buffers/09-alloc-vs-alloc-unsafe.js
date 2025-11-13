import { Buffer } from "node:buffer";

// creates buffer + initializes with 0
const bf1 = Buffer.alloc(4500);

// creates buffer but can have garbage data, also can leak secret info as it has data from the ram
const bf2 = Buffer.allocUnsafe(4500);

// console.log(bf1.toString());
// console.log(bf2.toString());


// *** performance metrics ***
console.time("Buffer.alloc");
for (let i = 0; i < 100000; i++) {
  Buffer.alloc(1024);
}
console.timeEnd("Buffer.alloc");
console.time("Buffer.allocUnsafe");
for (let i = 0; i < 100000; i++) {
  Buffer.allocUnsafe(1024);
}
console.timeEnd("Buffer.allocUnsafe");
/*
Buffer.alloc: 130.556ms
Buffer.allocUnsafe: 28.149ms
*/