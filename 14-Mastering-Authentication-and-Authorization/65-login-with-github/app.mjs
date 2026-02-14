import express from "express";

const app = express();

/*
Authorization: Bearer OAUTH-TOKEN
GET https://api.github.com/user
1. name,
2. email
3. avatar_url
4. id
*/

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;

  const params = new URLSearchParams({
    client_id,
    client_secret,
    code,
    redirect_uri,
    // code_verifier,
  });

  const tokenRes = await fetch(
    `https://github.com/login/oauth/access_token?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    },
  );
  const { access_token } = await tokenRes.json();

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const { id, name, avatar_url } = await userRes.json();

  const emailsRes = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const emails = await emailsRes.json();
  const primaryEmail = emails.find(({ primary }) => primary)?.email;

  res.redirect("http://localhost:3000");
});

app.listen(8080, () => console.log("server is running..."));
