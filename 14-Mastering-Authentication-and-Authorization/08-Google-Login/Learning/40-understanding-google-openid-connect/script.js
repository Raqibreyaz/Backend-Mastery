const code = new URLSearchParams(location.search).get("code");
const client_id = `<client_id>`;
const client_secret = `<client_secret>`;
const redirect_uri = `http://localhost:3000`;

async function fetchIdToken() {
  const body = `code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=authorization_code`;

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
  console.log(userData);
}

if (code) fetchIdToken();
