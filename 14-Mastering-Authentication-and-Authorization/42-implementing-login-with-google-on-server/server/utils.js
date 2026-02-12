import { writeFile } from "fs/promises";

const clientId =
  "233479796620-euvqpn89coqtru5upn67dkg3ba3tq0i0.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = `http://localhost:3000/callback.html`;

export async function fetchIdToken(code) {
  const body = `code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&grant_type=authorization_code`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await res.json();
  const userToken = data.id_token.split(".")[1];
  const userData = JSON.parse(atob(userToken));
  return userData;
}

export async function createSession(sessionsDB) {
  const sessionId = crypto.randomUUID();
  sessionsDB.push({ id: sessionId, userId: userData.sub });
  await writeFile("./sessionsDB.json", JSON.stringify(sessionsDB, null, 2));
}
