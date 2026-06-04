
# Node.js Buffer Instance Methods and Properties

This is a list of commonly used methods and properties for `Buffer` instances in Node.js.

## Properties

1. **`buffer.length`**  
   - Returns the size (in bytes) of the buffer.

2. **`buffer.byteLength`**  
   - Returns the actual byte length of the buffer content.

## Methods

1. **`buffer.toString([encoding], [start], [end])`**  
   - Converts the buffer data to a string using a specified encoding.

2. **`buffer.write(string, [offset], [length], [encoding])`**  
   - Writes a string to the buffer using the specified encoding.

3. **`buffer.slice([start], [end])`**  
   - Returns a new `Buffer` that references a subset of the original buffer.

4. **`buffer.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])`**  
   - Copies data from one buffer to another.

5. **`buffer.equals(otherBuffer)`**  
   - Compares two buffers and returns `true` if they are equal.

6. **`buffer.fill(value, [offset], [end], [encoding])`**  
   - Fills a buffer with a specified value.

7. **`buffer.readUInt8(offset)` / `buffer.writeUInt8(value, offset)`**  
   - Reads or writes an unsigned 8-bit integer at the specified offset.

8. **`buffer.readInt16LE(offset)` / `buffer.writeInt16LE(value, offset)`**  
   - Reads or writes a signed 16-bit integer, little-endian format.

9. **`buffer.subarray([start], [end])`**  
   - Creates a subarray view of the buffer without copying data.

10. **`buffer.includes(value, [byteOffset], [encoding])`**  
    - Returns `true` if the buffer contains the specified value.

## Additional Methods

- **`buffer.swap16()`**: Swaps the byte order in the buffer (for 16-bit values).
- **`buffer.swap32()`**: Swaps the byte order in the buffer (for 32-bit values).
- **`buffer.swap64()`**: Swaps the byte order in the buffer (for 64-bit values).
