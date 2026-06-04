/*
*** Typed Arrays ***
- Uint8Array
- Uint16Array
- Uint32Array
- Int8Array
- Int16Array
- Int32Array
- Float32Array
- Float64Array
- BigUint64Array
- BigInt64Array
- Uint8ClampedArray
*/

const a = new ArrayBuffer(4);

const uint8arr = new Uint8Array(a);

/* it is now resizable till 16 
abf.resize(num)
*/
const abf = new ArrayBuffer(4, { maxByteLength: 16 });

// create new buffer with same data
// clears all the memory of original
const b = a.transfer();

console.log(b);
console.log(abf);
console.log(uint8arr.buffer === b); //false

/*
const uint8arr = new Uint8Array(a);
const uint16arr = new Uint16Array(a);
const uint32arr = new Uint32Array(a);

console.log(uint8arr);
console.log(uint16arr);
console.log(uint32arr);
*/

/*
const uint8arr = new Uint8Array(4);

uint8arr[0] = 1;
uint8arr[1] = 2
*/

/*
const uint8arr = new Uint8Array([10, 44, 56, 23]);
console.log(uint8arr);
*/

/*
const uint8arr = new Uint8Array(2 ** 31 - 1).fill(0xff)
*/
