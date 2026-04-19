import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => res.sendStatus(200));

app.post("/webhook", (req, res, next) => {
  console.log(req.body);
  const status = req.body.payload.subscription.entity.status;
  const subscriptionId = req.body.payload.subscription.entity.id;
  const planId = req.body.payload.subscription.entity.plan_id;
  const whoPausedSubscription =
    req.body.payload.subscription.entity.pause_initiated_by;
  const whoCancelledSubscription =
    req.body.payload.subscription.entity.cancel_initiated_by;

  //   switch (req.body.event) {
  //     case "subscription.authenticated":
  //       break;
  //     case "subscription.paused":
  //       break;

  //     default:
  //       break;
  //   }

  res.sendStatus(200);
});

app.listen(4000, (error) => {
  if (error) return console.log(error);
  console.log(`Server is running at port ${4000}`);
});
