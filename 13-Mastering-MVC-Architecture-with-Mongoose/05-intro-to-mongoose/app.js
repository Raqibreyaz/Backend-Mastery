import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost:27017");

const pluralizer = mongoose.pluralize();

// console.log(pluralizer("mango")); //mangos
// mongoose.pluralize(
//   (word) => pluralizer(word.toLocaleLowerCase()) + "_collection",
// );

mongoose.set("autoCreate", false);

// const WolfModel = mongoose.model("wolf", {}); //wolves
const UserModel = mongoose.model("user", { name: String ,age:Number});
UserModel.insertOne({ name: "raquib" });

console.log("database connected!");
