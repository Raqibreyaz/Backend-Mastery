import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost:27017");
console.log("database connection requested");
