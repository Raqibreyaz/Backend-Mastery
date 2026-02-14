import { OAuth2Client } from "google-auth-library";

const clientId = "<client_id>";
const client = new OAuth2Client();

export async function fetchIdToken(idToken) {
  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  return loginTicket.getPayload();
}
