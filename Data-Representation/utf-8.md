- xxd <filename> gives hex dumped file in 2 chars blocks
- xxd -g 1 <filename> gives hex dumped file in 1 char blocks
- xxd -b <filename> gives binary dumped file

- 127 = 1111111 = 7F = DEL, the last char which will consume 1 byte space
following this format: 0xxxxxxx => 01111111

- 2047 = 11111111111 = 7FF, last char which will consume 2 bytes space following this format: 110xxxxx 10xxxxxx => 11011111 10111111

- 2048 = 100000000000 = 800, first char which will consume 3 bytes space following this format: 1110xxxx 10xxxxxx 10xxxxxx => 11100000 10100000 10000000

- 65536 = 10000000000000000 = 10000, first char which will consume 4 bytes space following this format: 11110xxxx 10xxxxxx 10xxxxxx 10xxxxxx => 11110000 1010000 10000000 10000000

1111 0110 0000 1010

11110000 10001111 10011000 10001010
11110000 10001111 10011000 10001010 