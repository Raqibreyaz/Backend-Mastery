import User from "./userModel.js";

const user = new User({
  name: "aman",
  age: 30,
  email: "aman@gmail.com",
});

await user.save()

