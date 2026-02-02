import User from "./userModel.js";

`
***Creating a User
const data = await User.create({
  name: "ankit",
  age: 23,
  email: "ankit@gmail.com",
  hobbies: ["coding"],
});

const data = await User.create([{
name: "ankit",
age: 23,
  email: "ankit@gmail.com",
  hobbies: ["coding"],
}]);

const data = new User({
  name: "ankit",
  age: 23,
  email: "ankit@gmail.com",
  hobbies: ["coding"],
});
console.log(data);
await data.save()
/*
{
  name: 'ankit',
  age: 23,
  email: 'ankit@gmail.com',
  hobbies: [ 'coding' ],
  parentId: null,
  _id: new ObjectId('698072ef5ad26c46cdcab52b')
}
*/
`;



`
***Finding User
* .lean() gives plain js object
const user = User.findOne({ email: "ankit@gmail.com" }).lean();
const user = User.find({ email: "ankit@gmail.com" }).lean();
`;




`
*** Updating a user
* returns old document by default
* doesn't validate in case of updating by default
const user = await User.findOneAndUpdate(
  { email: "ankit@gmail.com" },
  { age: 5 },
  { new: true, runValidators: true },
);

const user = await User.findOne({ email: "ankit@gmail.com" });
user.age = 5;
await user.save();
`
