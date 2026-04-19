import express from "express";
import { writeFile } from "node:fs/promises";
import Stripe from "stripe";

const app = express();
const stripeClient = new Stripe(process.env.STRIPE_API_SECRET);

app.use(express.json());

app.get("/", (req, res) => res.sendStatus(200));

app.post("/webhook", async (req, res) => {
  await writeFile("webhook-data.json", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(4000, (error) => {
  if (error) return console.log(error);

  console.log(`App is running at port ${4000}`);
});
