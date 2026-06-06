CommonJS
- Synchronous file loading
- file extension optional, any file can be loaded
- convention to use cjs in file extension
- 'this' points to module.exports by default
- cjs imports are not hoisted
- await can't be used outside
- strict mode not enabled by default
- only one thing can be exported

ES6 Modules
- Asynchronous file loading
- File extension Mandatory, we can't load any file only js and mjs are allowed
- 'this' points to undefined in global scope
- import statements are hoisted
- await can be used outside
- strict enabled by default
- multiple things can be exported, via named exports