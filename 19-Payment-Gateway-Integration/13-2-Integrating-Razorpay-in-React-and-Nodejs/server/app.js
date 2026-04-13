import express from "express";
import data from "./courses.json" with { type: "json" };
import cors from "cors";
import Razorpay from "razorpay";
import orders from "./orders.json" with { type: "json" };
import { writeFile } from "node:fs/promises";

const keyId = process.env.RZP_KEY_ID || "rzp_test_RBXbFzZlYlToFb";
const keySecret = process.env.RZP_KEY_SECRET || "ZycoIo5VmfC4Sj5tFAzHSgpP";

const rzpInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json(data);
});

app.post("/create-order", async (req, res) => {
  const { id, name, userContact } = req.body;

  const course = data.find((course) => course.id === id);
  if (!course) return res.status(400).json({ error: "course doesn't exist!" });

  const existingOrder = orders.find(
    (order) => order.courseId === id && order.userContact === userContact,
  );

  // check if user already bought the course
  if (existingOrder?.orderStatus === "paid")
    return res.status(400).json({ error: "course already purchased!" });

  // // check if there is already an order created for that course  by the user
  // if (existingOrder) return res.json({ orderId: existingOrder.orderId });

  const order = await rzpInstance.orders.create({
    amount: course.price * 100,
    currency: "INR",
    notes: {
      courseId: id,
      courseName: name,
    },
  });

  res.json({ orderId: order.id, keyId });
});

app.post("/complete-order", async (req, res) => {
  const { orderId, courseId, courseName, userName, userContact } = req.body;
  const order = await rzpInstance.orders.fetch(orderId);
  console.log(order);

  if (!order) {
    return res.status(404).json({ error: "Invalid order id" });
  }

  if (order.status === "paid") {
    orders.push({
      orderId,
      courseId,
      courseName,
      userName,
      userContact,
      orderStatus: "paid",
    });
    await writeFile("./orders.json", JSON.stringify(orders, null, 2));
    return res.json({ message: "Order Completed", status: "success" });
  }
  res.status(400).json({ error: "Order not completed", status: "failed" });
});

app.listen(4000, () => {
  console.log("Server started");
});
