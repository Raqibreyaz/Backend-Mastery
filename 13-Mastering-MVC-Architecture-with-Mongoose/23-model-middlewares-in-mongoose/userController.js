import User from "./userModel.js";

const result = await User.insertMany([
  { name: "Aman", email: "aman@aman.com", age: 23 },
]);
console.log(result);
