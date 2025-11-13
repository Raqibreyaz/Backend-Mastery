- 0x425A
(Big-Endian)     (Little-Endian)
0   1            0   1
42  5A           5A  42

- we need to tell before sending the data, what endian we are using by "Byte Order Mark (BOM)" FEFF
   (2-bytes) FEFF -> Big Endian (UTF-16)
   (2-bytes) FFFE -> Little Endian (UTF-16)
   (2-bytes) EFBBBF -> Big-Endian (UTF-8)

(Big-Endian)
  (header)
   0    1   2   3
   FE   FF  42  5A

(Little-Endian)
  (header)
   0    1   2   3
   FF   FE  5A  42

- Nodejs only supports "Little-Endian"

- FEFF is takes 16 bits, so it requires 3 bytes in utf-8
EF       BB       BF
11101111 10111011 10111111