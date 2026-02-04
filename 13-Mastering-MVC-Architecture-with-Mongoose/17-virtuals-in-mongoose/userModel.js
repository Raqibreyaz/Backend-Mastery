import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      minLength: [3, "Name should be of min.length 3"],
      trim: true,
      alias: "nam",
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
      ref: "User",
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
    virtuals: {
      isAdult: {
        get() {
          return this.age >= 18;
        },
      },
      hobbiesString: {
        get() {
          return this.hobbies.join(",");
        },
        set(value) {
          this.hobbies = [...this.hobbies, ...value.split(",")];
        },
      },
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

userSchema.virtual("emailDomain").get(function () {
  return this.email.split("@")[1];
});

export default mongoose.model("User", userSchema);
