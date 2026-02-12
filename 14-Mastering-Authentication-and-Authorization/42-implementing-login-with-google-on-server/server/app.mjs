import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs, { writeFile } from "fs/promises";
import { createSession, fetchIdToken } from "./utils.js";
import usersDB from "./usersDB.json" with { type: "json" };
import sessionsDB from "./sessionsDB.json" with { type: "json" };

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser("my-secret-key"));
app.use(express.json());

app.post("/google/login", async (req, res) => {
  const { sid } = req.signedCookies;

  let session = sid ? sessionsDB.find(({ id }) => sid === id) : null;
  if (session) return res.json({ message: "user already logged in!" });

  const { code } = req.body;
  const userData = await fetchIdToken(code);
  const user = usersDB.find((user) => user.id === userData.sub);
  session = user ? sessionsDB.find(({ userId }) => userId === user.id) : null;

  // when user not exists then create
  if (!user) {
    // create the user in DB
    usersDB.push({
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    });
    await fs.writeFile("./usersDB.json", JSON.stringify(usersDB, null, 2));
  }

  // create the session of the user(if !exists)
  if (!session) {
    session = {
      id: crypto.randomUUID(),
      userId: userData.sub,
    };
    sessionsDB.push(session);
    await writeFile("./sessionsDB.json", JSON.stringify(sessionsDB, null, 2));
  }

  res
    .status(200)
    .cookie("sid", session.id, {
      maxAge: 1000 * 86400,
      signed: true,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({ success: true, message: "user logged in successfully!" });
});

app.get("/profile", (req, res) => {
  const { sid } = req.signedCookies;

  const session = sid ? sessionsDB.find(({ id }) => id === sid) : null;
  if (!session) return res.status(401).json({ error: "Not logged in!" });

  const user = usersDB.find((user) => session.userId === user.id);
  if (!user) return res.status(404).json({ error: "user not found!" });

  res.json({ success: true, user });
});

app.post("/logout", async (req, res) => {
  const { sid } = req.signedCookies;

  const sessionIndex = sid ? sessionsDB.findIndex(({ id }) => id === sid) : -1;
  if (!sessionIndex === -1)
    return res.status(401).json({ error: "Not logged in!" });

  sessionsDB.splice(sessionIndex, 1);
  await writeFile("./sessionsDB.json", JSON.stringify(sessionsDB));

  res
    .clearCookie("sid")
    .json({ success: true, message: "user logged out successfully!" });
});

app.listen(8080, () => console.log("server is running at port 8080"));
