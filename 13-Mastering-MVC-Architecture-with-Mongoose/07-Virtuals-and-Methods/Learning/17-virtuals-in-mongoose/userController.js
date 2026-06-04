import User from "./userModel.js";

const user = await User.findOne({ email: "ankit@gmail.com" }).populate({
  path: "parentId",
  select: "name age -_id",
});

console.log(user.id);
// console.log(user.toJSON({virtuals:true}).id);
console.log(user.schema.virtuals);
console.log(user.hobbiesString);
console.log(user.emailDomain);

user.hobbiesString = "badminton,chess";

await user.save()

console.log(user.hobbiesString);
