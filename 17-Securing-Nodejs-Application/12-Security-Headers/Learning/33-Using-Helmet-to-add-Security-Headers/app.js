import express from "express";
import helmet from "helmet";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "'self'",
          "example.com",
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
      },
    },
    crossOriginEmbedderPolicy: false,t
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!\n");
});

app.listen(8080, () => {
  console.log(`server is running on port 8080`);
});
