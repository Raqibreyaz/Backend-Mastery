import express from "express";
import mongoose from "mongoose";
import cors from "cors";

await mongoose.connect(
  "mongodb://admin:admin@localhost/socialApp?authSource=admin",
);

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.headers.accept?.includes("text/html"))
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self';\
       script-src 'self' 'report-sample' 'unsafe-inline' https://*.tailwindcss.com http://localhost:8080/script.js;\
       img-src 'self' https://images.unsplash.com;\
       style-src 'self' 'unsafe-inline';\
       connect-src 'self' http://localhost:8000;\
       report-uri /csp-violations`,
    );

  next();
});

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
  const post = new Post({ content: req.body.content });
  await post.save();
  res.status(201).json(post);
});

app.post(
  "/csp-violations",
  express.json({ type: "application/csp-report" }),
  async (req, res) => {
    console.log(req.body);
    res.status(204).end();
  },
);

// Start server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
