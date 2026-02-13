import { OAuth2Client } from "google-auth-library";

const clientId = "<client_id>";
const clientSecret = "<client_secret>";
const redirectUri = "http://localhost:8080/auth/google/callback";
const client = new OAuth2Client();

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

  const loginTicket = await client.verifyIdToken({
    idToken: data.id_token,
    audience: clientId,
  });

  return loginTicket.getPayload()
}

export function getAuthUrl() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=openid%20email%20profile&redirect_uri=${redirectUri}`;
  return authUrl;
}
