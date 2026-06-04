import path from "node:path";

console.log(path.join("/", "../../../hello", "hi"));
// /hello/hi

console.log(path.normalize("./../../test"));
// /test

console.log(path.resolve("hi", "test"));
// /mnt/data1/my-files/Backend-Mastery/hi/test

console.log(path.resolve("/hi", "test"));
// /hi/test

console.log(path.basename("/mnt/data1/my-files/Backend-Mastery/hi/test"));
// test

console.log(path.dirname("/mnt/data1/my-files/Backend-Mastery/hi/test"));
// /mnt/data1/my-files/Backend-Mastery/hi

console.log(import.meta.dirname);
// /mnt/data1/my-files/Backend-Mastery/11-Building-RESTful-APIs-with-Express

console.log(
  path.join(
    import.meta.dirname,
    "storage/",
    path.join("/", "../..///backend",'../../xyz'),
  ),
);