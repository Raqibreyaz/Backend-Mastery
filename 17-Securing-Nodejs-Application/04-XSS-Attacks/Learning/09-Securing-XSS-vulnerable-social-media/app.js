import express from "express";
import mongoose from "mongoose";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";

const app = express();
const window = new JSDOM("").window;
const DOMPurify = createDomPurify(window);

app.use((req, res, next) => {
  res.setHeaders(
    new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    }),
  );
  next();
});

app.use(express.json());

await mongoose.connect(
  "mongodb://admin:admin@localhost/socialApp?authSource=admin",
);

const postSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Middleware
app.use(express.static("./public"));

// Routes
app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.setHeader("Set-Cookie", "loginSecret=hdxhw7yrx.k;httpOnly=true");
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const sanitizedHtml = DOMPurify.sanitize(req.body.content);

  if (!sanitizedHtml)
    return res.status(400).json({ error: "Malicious Content!" });

  const post = new Post({ content: sanitizedHtml });
  await post.save();
  res.status(201).json(post);
});

// Start server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
