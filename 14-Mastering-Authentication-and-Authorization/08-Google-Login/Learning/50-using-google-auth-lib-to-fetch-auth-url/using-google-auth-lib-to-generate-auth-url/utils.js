import { OAuth2Client } from "google-auth-library";

const client_id = "<client_id>";
const client_secret = "<client_secret>";
const redirectUri = "http://localhost:8080/auth/google/callback";

const client = new OAuth2Client({
  client_id,
  client_secret,
  redirectUri,
});

export async function fetchIdToken(code) {
  const { tokens } = await client.getToken(code);

  const loginTicket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: client_id,
  });

  return ({ sub: userId, email, picture } = loginTicket.getPayload());
}

export function getAuthUrl() {
  return client.generateAuthUrl({ scope: ["email", "profile", "openid"] });
}
