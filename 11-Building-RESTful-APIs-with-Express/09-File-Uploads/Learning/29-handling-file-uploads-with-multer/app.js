/*
original:
  user[firstName]=Raquib&user[lastName]=Reyaz&nums[]=1&nums[]=2&nums[]=3&email=raquib@raquib.com

extended: true
  user: { firstName: 'Raquib', lastName: 'Reyaz' },
  nums: [ '1', '2', '3' ],
  email: 'raquib@raquib.com'

extended: false
{
  'user[firstName]': 'Raquib',
  'user[lastName]': 'Reyaz',
  'nums[]': [ '1', '2', '3' ],
  email: 'raquib@raquib.com'
}
*/

import express from "express";

const app = express();

app.use(express.static("public"));

// app.use(express.urlencoded({ extended: false }));

app.post("/user", (req, res) => {
  console.log(req.body);
  req.on("data", (chunk) => console.log(decodeURIComponent(chunk.toString())));
  res.json({ message: "Got Data" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
