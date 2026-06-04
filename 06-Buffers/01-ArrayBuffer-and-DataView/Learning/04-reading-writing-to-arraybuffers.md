```js
const arr_buffer = new ArrayBuffer(10);

/*
1. multiple data views can be assigned for a single array buffer
2. byte offset: is simply the starting index where the dataview will start to point to arraybuffer
3. dv.set* and dv.get* to perform set and get ops
*/
const dv = new DataView(arr_buffer);
const dv2 = new DataView(arr_buffer, 2);
```

1. we can set values of any signedness but it is upto the 'get\*' which interpret with what user want

```js
dv.setInt8(0, 255); // signed 8 bit can only have-> [-128,127]
dv.getInt8(0); // -1
dv.getUint8(0); // 255
```
