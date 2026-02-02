# Mongoose Schema Field Options

Mongoose provides various options that can be passed inside a schema field definition to customize its behavior.

## Available Schema Options

| Option                    | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `type`                    | Defines the field data type.                                                              |
| `required`                | Makes the field mandatory. Can be a boolean, function, or an array with a custom message. |
| `unique`                  | NOT a validator. It only creates a MongoDB index.                                         |
| `default`                 | Provides a default value if none is given when creating a document.                       |
| `enum`                    | Restricts the field to specific values. Used for defining allowed values.                 |
| `validate`                | Adds custom validation logic, can be synchronous or asynchronous.                         |
| `match`                   | Validates the value using a regular expression pattern.                                   |
| `minlength` / `maxlength` | Sets minimum and maximum length for strings.                                              |
| `min` / `max`             | Defines minimum and maximum values for numbers or dates.                                  |
| `lowercase`               | Converts the string to lowercase before saving.                                           |
| `uppercase`               | Converts the string to uppercase before saving.                                           |
| `trim`                    | Removes whitespace from the beginning and end of a string.                                |
| `immutable`               | Prevents modifications after the document is created.                                     |
| `alias`                   | Creates a virtual field alias for another field.                                          |
| `get`                     | Defines a getter function to transform the value when retrieved.                          |
| `set`                     | Defines a setter function to modify the value before saving.                              |
| `select`                  | Excludes the field from queries unless explicitly included.                               |

## Example Schema with Various Options

```js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
    validate: {
      validator: async function (value) {
        const existingUser = await mongoose
          .model("User")
          .findOne({ email: value });
        return !existingUser;
      },
      message: "Email already exists",
    },
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 99,
  },
  password: {
    type: String,
    required: true,
    select: false, // Do not return password by default
    set: (value) => bcrypt.hashSync(value, 10), // Hash password before saving
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const User = mongoose.model("User", userSchema);
```
