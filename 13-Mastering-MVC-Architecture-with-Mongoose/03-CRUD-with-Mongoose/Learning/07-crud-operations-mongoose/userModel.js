import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = mongoose.Schema(
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
    hobbies: {
      type: [String],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.age < 16;
      },
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);