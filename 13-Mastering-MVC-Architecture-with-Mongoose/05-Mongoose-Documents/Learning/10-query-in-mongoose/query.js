import User from "./userModel.js";

// const query = User.find({ age: { $gte: 15 } });
const query = User.where("age").gte(15)

// query.select("-password")
// query.select({name:1,age:1})
// query.projection({name:1})
query.select("name age").sort({ age: -1 });

console.log(query.getQuery()); // { age: { $gte: 15 } }

// console.log(await query);
console.log(await query.exec()); //returns a true promise
