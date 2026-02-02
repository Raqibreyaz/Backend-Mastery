import User from "./userModel.js";

const user = await User.findOne({ email: "ankit@gmail.com" }).populate({
  path: "parentId",
  select: "name age -_id",
});

console.log(user);
