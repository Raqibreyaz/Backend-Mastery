# Creating an HTTPS Express Server Using OpenSSL

## Step 1: Generate SSL Certificate and Key with OpenSSL

Run the following command in your terminal:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365
```

This creates:
- `key.pem`: Your private key
- `cert.pem`: Your self-signed SSL certificate

> Note: You'll be prompted for details like Country, State, etc. You can skip them by pressing Enter.

---

## Step 2: Update Your Express Code to Use HTTPS

Replace your HTTP server code with the following code:

```js
// index.js
import express from "express";
import https from "https";
import fs from "fs";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Secure World 🔒");
});

const PORT = 4000;

const sslOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem")
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 HTTPS server running at https://localhost:${PORT}`);
});
```
---

## Step 3: Run Your Server

```bash
node index.js
```

---

## Step 4: Visit in Your Browser

Open your browser and navigate to:

```
https://localhost:4000
```

> ⚠️ You'll see a security warning because the certificate is self-signed. Click "Advanced" → "Proceed".
