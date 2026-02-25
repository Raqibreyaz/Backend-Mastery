import * as z from "zod";

// const schema = z.string("Please enter a valid string").regex(/^\d{4}$/,'input must be a 4 digit number')
const schema = z.object({
  name: z
    .string()
    .min(2, "Name should have at least 2 chars")
    .max(100, "Please enter at max 100 characters"),
  age: z.number().lt(120, "Age must be lesser than 120"),
  email: z.email().optional(),
});

const input = {
  name: "raquib",
  age: 40,
  email: "reyaz@reyaz.com",
  rest: "data",
  "rest-rest":"data-data"
};
// { name: 'raquib', age: 40, email: 'reyaz@reyaz.com' }

// const data = User.parse(input);
const result = schema.safeParse(input);

if (result.success) console.log(result.data);
else console.log(result.error.issues);
