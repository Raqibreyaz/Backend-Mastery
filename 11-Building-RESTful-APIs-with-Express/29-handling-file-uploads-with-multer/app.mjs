import express from "express";
import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads");
  },
  filename(req, file, cb) {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post(
  "/upload",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  (req, res) => {
    console.log(req.files);
    console.log(req.body);
    res.json({ files: req.files, body: req.body });
  },
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
