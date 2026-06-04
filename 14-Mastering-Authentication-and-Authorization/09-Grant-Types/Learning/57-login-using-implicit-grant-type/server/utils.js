import { OAuth2Client } from "google-auth-library";

const clientId =
  "233479796620-ch30kn6215kfo0rjln4kk5r6nmt0us29.apps.googleusercontent.com";
const client = new OAuth2Client();

export async function fetchIdToken(idToken) {
  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  return loginTicket.getPayload();
}