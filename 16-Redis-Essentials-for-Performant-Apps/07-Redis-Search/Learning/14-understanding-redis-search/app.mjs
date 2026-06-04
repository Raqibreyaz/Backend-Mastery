import { createClient } from "redis";

const redisClient = createClient();
await redisClient.connect();

// const users = [
//   { name: "Sahil Khandekar", age: 24, city: "Delhi" },
//   { name: "Srujan", age: 26, city: "Mumbai" },
//   { name: "Md Ashraful Momin", age: 22, city: "Kolkata" },
//   { name: "Sanat", age: 24, city: "Delhi" },
//   { name: "Varun Sagar", age: 27, city: "Bangalore" },
//   { name: "Kushagra Rathore", age: 26, city: "Mumbai" },
//   { name: "Mash", age: 23, city: "Hyderabad" },
//   { name: "Kartik Goyal", age: 25, city: "Pune" },
//   { name: "Salim Raza", age: 24, city: "Delhi" },
//   { name: "Shubham Semwal", age: 28, city: "Chandigarh" },
//   { name: "Vishwajeet Kumar", age: 22, city: "Kolkata" },
//   { name: "Ranipa sahaj", age: 25, city: "Pune" },
//   { name: "Asish Kumar Sahu", age: 29, city: "Bhubaneswar" },
//   { name: "Bhupesh Kumar", age: 30, city: "Delhi" },
//   { name: "Zohaib", age: 26, city: "Mumbai" },
//   { name: "Kushal khanal", age: 23, city: "Kathmandu" },
//   { name: "Arjun Khatri", age: 28, city: "Chandigarh" },
//   { name: "Aziz Ur Rehman", age: 27, city: "Bangalore" },
//   { name: "Sujay", age: 22, city: "Kolkata" },
//   { name: "Harsh Chourasiya", age: 25, city: "Pune" },
// ];

// for (let i = 0; i < users.length; i++) {
//   const key = `user:${i}`;
//   await redisClient.json.set(key, "$", users[i]);
// }

const indexes = await redisClient.ft.info("zeroIdx");
console.log(indexes);

// ---
// 📋 Get Information About an Index
// const result = await redisClient.ft.search("nameIdx", "@name:Kumar");
// console.log(result);

redisClient.quit();
