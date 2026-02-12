const clientId =
  "233479796620-euvqpn89coqtru5upn67dkg3ba3tq0i0.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "http://localhost:8080/auth/google/callback";

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

export function getAuthUrl() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=openid%20email%20profile&redirect_uri=${redirectUri}`;
  return authUrl;
}
