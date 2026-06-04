/*
Express lets you use regular expressions to match route paths more flexibly.
Instead of a fixed path string, you use a RegEx pattern to define routes.

Benefits

    Flexible matching: Match complex or variable patterns that can’t be expressed easily with normal params.
    Fine control: You can restrict allowed values (e.g., digits only).
    Useful for legacy URLs or when paths don’t follow simple patterns.

Drawbacks

    Harder to read and maintain: RegEx can be complex and confusing for others reading your code.
    No named params: Captured groups are accessed by index (req.params[0]), not by names.
    Can be error-prone if regex is not carefully written.
*/

import express from "express";

const app = express();

// match either route(express 5 not supported)
// app.get("/folder|directory", (req, res) => {
//   res.send("hello world");
// });

// app.get(/^\/(\d+)$/, (req, res) => {
//   res.json({ double: req.params[0] * 2 });
// });

// express 5 not supported
app.get('/:id([0-9])',(req,res)=>{
    res.json({message:`hello`})
})

app.listen(3000, () => console.log("server is running at port 3000"));
