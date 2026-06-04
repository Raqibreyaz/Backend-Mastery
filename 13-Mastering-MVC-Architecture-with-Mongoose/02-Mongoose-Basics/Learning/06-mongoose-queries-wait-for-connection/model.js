import mongoose from "mongoose";

const UserModel = mongoose.model("User", { name: String, age: Number });

// console.log("inserting data");
// UserModel.insertOne({ name: "raquib" });

// mongoose waits 10s as buffer time when connection is not established
const data = await UserModel.findOne({ name: "raquib" });
// data.then((dataRes) => console.log(dataRes));
console.log(data);
