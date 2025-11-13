import { Buffer, constants } from "node:buffer";

// creates new ArrayBuffer for each buffer
const a = Buffer.alloc(4);

console.log(constants.MAX_LENGTH);
console.log(constants.MAX_STRING_LENGTH);

/*

*** Buffer.allocUnsafe ***
every buffer will have same buffer pool means they will have shared memory but differentiated by offset 

- Buffer Pool: it is the ArrayBuffer, termed as Buffer Pool as it is used for multiple buffers

- Byte Offset: every other buffer of the same buffer pool have different offset of the ArrayBuffer to start, means memory address of buffer1[0] != buffer2[0]

- can we alter values of different buffer -> no
b's size = 4
b[6] = 8 -> no effect

- we can't resize the buffer!

- starting 8 bytes of buffer pool may be unassigned to any buffer, means offset=8 will be starting for first buffer in that case

- a buffer will only be assigned to the pool if and only if it requires bytes < floor(poolSize/2) as well as buffer pool has the capacity left to provide that amount, but still is not guaranteed even buffer pool looks like it has that size left

- lets say required bytes = rb
if buffer pool can't provide that amount then it creates a new buffer pool of size = rb < 4096 ? 8192 : rb

- it is generally noted that max bytes we can use = 8183

- changing the buffer.poolSize will reflected on next allocation not initial
means initially 8192 size will be considered and when it goes full then new size will be considered

- Buffer.from() uses 'allocUnsafe' behind the scene

*/

// still initial pool size = 8192
Buffer.poolSize = 10000;

const b = Buffer.allocUnsafe(4000 + 100);
const c = Buffer.allocUnsafe(4000);
const d = Buffer.allocUnsafe(50);
const e = Buffer.allocUnsafe(30);

// can be allocated to the same previous buffer pool
const x = Buffer.concat([d, e]);

// dont use buffer pool ,directly asks memory from OS
// means y.byteLength == y.buffer.byteLength 
const y = Buffer.allocUnsafeSlow(10)

for (let i = 0; i < 5; i++) {
  b[i] = i + 1;
  c[i] = i + 1;
}

b[6] = 8;

console.log(b.buffer === c.buffer);

console.log(a);
console.log(b);
console.log("end");
