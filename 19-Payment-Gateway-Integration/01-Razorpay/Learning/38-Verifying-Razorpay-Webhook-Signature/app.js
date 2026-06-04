import crypto from "node:crypto";
import express from "express";

const app = express();
const webhookSecret = "<secret>";

app.get("/", (req, res, next) => res.sendStatus(200));

app.use(express.json());

app.post(
  "/webhook",
  //   express.raw({ type: "application/json" }),
  (req, res, next) => {
    console.log(req.body);
    const webhookSignature = req.headers["x-razorpay-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    console.log(webhookSignature);
    console.log(generatedSignature);

    if (
      !crypto.timingSafeEqual(
        Buffer.from(webhookSignature),
        Buffer.from(generatedSignature),
      )
    )
      return res.sendStatus(403);

    const status = req.body.payload.subscription.entity.status;
    const subscriptionId = req.body.payload.subscription.entity.id;
    const planId = req.body.payload.subscription.entity.plan_id;
    const whoPausedSubscription =
      req.body.payload.subscription.entity.pause_initiated_by;
    const whoCancelledSubscription =
      req.body.payload.subscription.entity.cancel_initiated_by;

    console.log("status", status);
    console.log("who-paused-subscription", whoPausedSubscription);
    console.log("who-cancelled-subscription", whoCancelledSubscription);

    res.sendStatus(200);
  },
);

app.listen(4000, (error) => {
  if (error) return console.log(error);
  console.log(`Server is running at port ${4000}`);
});
