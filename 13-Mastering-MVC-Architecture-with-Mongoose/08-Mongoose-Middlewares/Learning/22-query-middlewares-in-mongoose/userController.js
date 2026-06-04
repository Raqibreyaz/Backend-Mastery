import User from "./userModel.js";

const user = await User.find({name:"raquib"}).exec()
console.log(user)
