const abf = new ArrayBuffer(10);
const dv = new DataView(abf);

dv.setInt16(0, 257);
dv.setInt16(2, 3000);

// stores the value as little endian
dv.setInt16(4, 4000, true);

dv.setInt32(6, 9000000);
console.log(dv.getInt32(6));

// reads the value as little endian
console.log(dv.getInt16(4, true));

/*
1. every index in array will always be of 1byte
2. for 16bit it is taking 2 indices to store the number
*/

// for (let i = 0; i < dv.byteLength; i += 2) console.log(dv.getInt16(i));
