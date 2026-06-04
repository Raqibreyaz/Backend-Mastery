/*
->Run JavaScript files using the Mongo shell:
        mongosh your_script.js

    -> Inside the JS file, write only valid JavaScript code using MongoDB API methods.

    -> Use db.getCollection("name") to access collections, especially if the collection name has special characters or spaces.
*/

use("todoApp");

// if (db.todos.find().toArray().length == 1)
//   db.todos.updateOne(
//     { title: "Complete MongoDB" },
//     { $set: { title: "sabji le kr aao" } },
//   );
// else
// db.getCollection()
const todos = db.getCollection("todos");
for (let i = 1; i <= 10; i++) {
  db.todos.insertOne({ title: `Task ${i}`, completed: i % 2 == 0 });
}

console.log(db.todos.find());
