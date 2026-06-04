import mongoose from "mongoose";
import User from "./userModel.js";

await User.init();

const user1 = await User.findById("69835a78de17967976227d5f");
const user2 = await User.findById("69835a78de17967976227d5f");

console.log(user1.__v);
user1.balance += 200;
// user1.hobbies.splice(2, 1);
await user1.save();
console.log(user1.__v);

console.log(user2.__v);
user2.balance += 500;
// user2.hobbies.splice(2, 1);
await user2.save();
console.log(user2.__v);

// User.updateOne({ _id: "69835a78de17967976227d5f", __v: 2 });

setTimeout(() => {
  mongoose.disconnect();
}, 100);
