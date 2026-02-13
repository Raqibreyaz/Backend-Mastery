import { OAuth2Client } from "google-auth-library";

const clientId = "<client_id>";
const clientSecret = "<client_secret>";
const redirectUri = "http://localhost:8080/auth/google/callback";
const client = new OAuth2Client({
  client_id: clientId,
  client_secret: clientSecret,
  redirectUri,
});

export async function fetchIdToken(code) {
  const { tokens } = await client.getToken(code);

  const loginTicket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId,
  });

  return loginTicket.getPayload();
}

export function getAuthUrl() {
  return client.generateAuthUrl({
    scope: ["email", "profile", "openid"],
    // prompt: "none",
    // login_hint: "raquib@gmail.com"
  });

  // prompt: none,select_account,consent
}
