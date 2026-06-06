console.log(import.meta);
/*

[Object: null prototype] {
  dirname: '/mnt/data1/my-files/Node-Basics/Modules',
  filename: '/mnt/data1/my-files/Node-Basics/Modules/esm-module.js',
  resolve: [Function: resolve],
  url: 'file:///mnt/data1/my-files/Node-Basics/Modules/esm-module.js'
}

*/
import.meta.name = "raquib";
console.log(import.meta);
/*

[Object: null prototype] {
  dirname: '/mnt/data1/my-files/Node-Basics/Modules',
  filename: '/mnt/data1/my-files/Node-Basics/Modules/esm-module.js',
  resolve: [Function: resolve],
  url: 'file:///mnt/data1/my-files/Node-Basics/Modules/esm-module.js',
  name: 'raquib'
}

*/

console.log(import.meta.dirname);
console.log(process.cwd());
/*

/mnt/data1/my-files/Node-Basics/Modules
/mnt/data1/my-files/Node-Basics

*/