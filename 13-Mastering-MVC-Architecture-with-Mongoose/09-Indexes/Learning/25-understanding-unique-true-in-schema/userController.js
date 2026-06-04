import mongoose from "mongoose";
import User from "./userModel.js";

// initialize the collection(good for indexes)
await User.init()

const result = await User.insertMany([
  { name: "Aman", email: "aman@aman.com", age: 23 },
]);
console.log(result);

// mongoose may not create the index instantly, so give delay, but there's a better way to do
setTimeout(() => {
  mongoose.disconnect();
}, 100);