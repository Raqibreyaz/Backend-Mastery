- arraybuffer = array of bytes, cant be resized, modified and read once created

- doesnt consumes space even if 1gb space is allocated when no data is initialised while creating it

- we use typed arrays and dataview to update the arraybuffer

- at max 2gb memory can be allocated with it