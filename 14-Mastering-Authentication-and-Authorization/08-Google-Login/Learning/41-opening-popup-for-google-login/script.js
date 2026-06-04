const client_id = `<client_id>`;
const client_secret = `<client_secret>`;
const redirect_uri = `http://localhost:3000/callback.html`;
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&scope=openid%20email%20profile&redirect_uri=${redirect_uri}`;

const button = document.querySelector(".button");

button.addEventListener("click", () => {
  window.open(authUrl, "login-popup", "left=200,top=200,height=420,width=420");
});

async function fetchIdToken({ data: { code } }) {
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

window.addEventListener("message", fetchIdToken);
