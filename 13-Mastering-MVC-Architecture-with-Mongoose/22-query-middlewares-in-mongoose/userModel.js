import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      minLength: [3, "Name should be of min.length 3"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required!"],
      min: [12, "Age is required and should be at least 12"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
        "please enter a valid email",
      ],
    },
    password: String,
    hobbies: {
      type: [String],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.age < 16;
      },
      ref: "User",
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

// here 'this' refers to the query object not mongoose document
userSchema.pre("find", function () {
  this.find({ age: { $gte: 20 } }).select("name age -_id");
});

userSchema.pre("findOne", () => this.findOne({ age: { $gte: 21 } }));

// runs for all pre find-related ops
// userSchema.pre(/^find/,()=>{})

// userSchema.post("find", (doc) => {});

export default mongoose.model("User", userSchema);
