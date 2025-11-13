console.log(parseInt(0x1000, 16));

const map = {
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

// convert number of base(radix) to decimal
function convertToDecimal(number, radix) {
  let m = 1;
  let i = number.length - 1;
  let newNumber = 0;

  while (i >= 0) {
    newNumber = map[number[i]] * m + newNumber;
    m *= radix;
    i--;
  }

  return newNumber;
}

console.log(convertToDecimal([1, "f", 4, "c"], 16));
