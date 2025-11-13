const a = new ArrayBuffer(10);

const dv = new DataView(a);

[0b11100,20, 12, 250, 256, 232, 1000, 0x23].forEach((val, index) => {
  dv.setInt8(index, val);
});

for (let i = 0; i < dv.byteLength; i++) console.log(dv.getInt8(i));
