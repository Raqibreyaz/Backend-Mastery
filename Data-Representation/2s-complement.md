### 8 bit Integer: Int8

- can store at in this range: [-127,128]
- Int8(127) = 127
- Int8(128) = -128
- Int8(255) = -1
- Int8(1000) = -24

```
       7 6 5 4 3 2 1 0
128 = [1,0,0,0,0,0,0,0]

but leading 1 -> -1 ?
yes but also used as value
=> -128
```

```
                    7 6 5 4 3 2 1 0
1000 % 256 = 232 = [1,1,1,0,1,0,0,0]
=> -128 + 64 + 32 + 0 + 8 + 0 + 0 + 0
=> -24

basically it takes out only 8 bits from left so it is % 256
```

```
  00000101  (+5)
+ 11111101  (-3) (2s complement of 3)
-----------
  00000010  (+2)  ← Correct! And no special logic needed!
```
