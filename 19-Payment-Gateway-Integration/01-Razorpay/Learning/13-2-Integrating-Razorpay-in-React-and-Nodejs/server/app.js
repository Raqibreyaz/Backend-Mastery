import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import Nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import { writeFile } from "node:fs/promises";

import courses from "./courses.json" with { type: "json" };
import orders from "./orders.json" with { type: "json" };
import sessions from "./sessions.json" with { type: "json" };
import otps from "./otps.json" with { type: "json" };

const COURSES_FILE = "./courses.json";
const ORDERS_FILE = "./orders.json";
const SESSIONS_FILE = "./sessions.json";
const OTPS_FILE = "./otps.json";

const keyId = process.env.RZP_KEY_ID || "rzp_test_RBXbFzZlYlToFb";
const keySecret = process.env.RZP_KEY_SECRET || "ZycoIo5VmfC4Sj5tFAzHSgpP";

// Create a transporter using SMTP
const transporter = Nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASS,
  },
});

const rzpInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// session middleware
app.use(async (req, res, next) => {
  // add session if not exists
  if (!req.cookies.session) {
    const ip = req.socket.remoteAddress;
    // use if session already exist for that ip else generate new
    let session = sessions.find((session) => session.ip === ip);

    if (!session) {
      session = {
        cart: [],
        id: crypto.randomUUID(),
        ip: req.socket.remoteAddress,
        userEmail: null,
        userMobile: null,
        userName: null,
        purchasedCourses: [],
      };

      sessions.push(session);
      await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    }

    // send a cookie in response
    req.cookies.session = session.id;
    res.cookie("session", session.id, {
      httpOnly: true,
      maxAge: 86400 * 1000,
    });
  }
  next();
});

app.get("/me", (req, res, next) => {
  const sessionId = req.cookies.session;

  const session = { ...sessions.find((session) => session.id === sessionId) };

  res.json({ session });
});

// get all available courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// add course to cart
app.post("/cart/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;
  const session = sessions.find(
    (session) => session.id === req.cookies.session,
  );

  // course might not exist
  if (courses.findIndex((course) => course.id === courseId) === -1)
    return res.status(400).json({ error: "Invalid course id!" });

  // course might already been purchased
  if (session.purchasedCourses.indexOf(courseId) !== -1)
    return res.status(400).json({ error: "course already purchased!" });

  // course might already added to cart
  if (session.cart.indexOf(courseId) !== -1)
    return res.status(400).json({ error: "course already added to cart!" });

  session.cart.push(courseId);
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

  res.json({ message: "course added to cart!" });
});

// remove course from cart
app.delete("/cart/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;
  const session = sessions.find(
    (session) => session.id === req.cookies.session,
  );

  // course might not present in cart
  const courseIndex = session.cart.indexOf(courseId);
  if (courseIndex === -1)
    return res.status(400).json({ error: "course not present in cart!" });

  session.cart.splice(courseIndex, 1);
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

  res.json({ message: "course added to cart!" });
});

app.post("/send-otp", async (req, res, next) => {
  const email = req.body?.email;
  if (!email) return res.status(400).json({ error: "email is required!" });

  // send 6-digit otp to the given email
  const otp = crypto.randomInt(100000, 999999);

  otps.push({ otp, email, sentAt: Date.now() });
  await writeFile(OTPS_FILE, JSON.stringify(otps, null, 2));

  const html = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"LMS Team" <${process.env.NODEMAILER_USER_EMAIL}>`,
      to: email,
      subject: "Email Verification OTP",
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return res.json({ message: "otp sent successfully!" });
  } catch (err) {
    console.error("Error while sending mail:", err);
    return res.status(500).json({ error: err });
  }
});

app.put("/update-contact-info", async (req, res, next) => {
  const sessionId = req.cookies.session;
  let otp = req.body?.otp;
  const mobile = req.body?.mobile;
  const userName = req.body?.name;

  // otp can be of some other type or not of 6 digits
  if (typeof otp !== "string" || isNaN(otp) || otp.length !== 6)
    return res.status(400).json({ error: "Invalid OTP!" });
  otp = parseInt(otp);

  if (
    !mobile ||
    !userName ||
    typeof mobile !== "string" ||
    typeof userName !== "string" ||
    mobile.length !== 10
  )
    return res.status(400).json({
      error:
        "mobile and name both are required and must be string + mobile should be 10-digit!",
    });

  // otp might not exist
  const otpIndex = otps.findIndex((savedOtp) => savedOtp.otp === otp);
  if (otpIndex === -1) return res.status(400).json({ error: "Invalid OTP!" });

  const savedOtp = otps[otpIndex];
  otps.splice(otpIndex, 1);
  await writeFile(OTPS_FILE, JSON.stringify(otps, null, 2));

  // otp might be expired
  const timePassedInMins = Math.round(
    (Date.now() - savedOtp.sentAt) / (1000 * 60),
  );
  if (timePassedInMins > 10)
    return res.status(400).json({ error: "OTP expired!" });

  // update session DB
  const session = sessions.find((session) => session.id === sessionId);
  session.userEmail = savedOtp.email;
  session.userMobile = mobile;
  session.userName = userName;

  // find all the purchased courses of the user
  session.purchasedCourses = orders
    .filter((order) => order.userEmail === savedOtp.email)
    .reduce((prevArr, order) => [...prevArr, ...order.courses], []);

  // filter out courses which are already purchased
  session.cart = session.cart.filter(
    (courseId) => !session.purchasedCourses.includes(courseId),
  );

  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

  res.json({ message: "Contact Info Updated!" });
});

app.post("/create-order", async (req, res) => {
  const sessionId = req.cookies.session;

  const session = sessions.find((session) => session.id === sessionId);

  // mobile and email must exist for payment
  if (!session.userEmail || !session.userMobile || !session.userName)
    return res
      .status(400)
      .json({ error: "Email and Mobile both must be available!" });

  // throw when course(s) are purchased already
  const alreadyPurchased = session.cart.find((courseId) =>
    session.purchasedCourses.includes(courseId),
  );
  if (alreadyPurchased)
    return res
      .status(400)
      .json({ error: "Remove already purchased courses from cart!" });

  // find all the courses present in cart
  const cartCourses = courses.filter((course) =>
    session.cart.includes(course.id),
  );

  // calculate total of courses amount
  const totalAmount = cartCourses.reduce(
    (prevTotal, { price }) => prevTotal + price,
    0,
  );

  const order = await rzpInstance.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    notes: {
      totalCourses: cartCourses.length,
      coursesName: cartCourses.map((course) => course.name).join(","),
    },
    customer_details: {
      contact: session.userMobile,
      email: session.userEmail,
      name: session.userName,
    },
  });

  res.json({
    orderId: order.id,
    keyId,
    prefill: {
      name: session.userName,
      email: session.userEmail,
      contact: session.userMobile,
    },
  });
});

app.post("/complete-order", async (req, res) => {
  const sessionId = req.cookies.session;
  const session = sessions.find((session) => session.id === sessionId);

  const orderId = req.body?.orderId;
  const order = await rzpInstance.orders.fetch(orderId);
  console.log(order);

  if (!order) {
    return res.status(404).json({ error: "Invalid order id" });
  }

  if (order.status === "paid") {
    orders.push({
      orderId,
      courses: [...session.cart],
      userEmail: session.userEmail,
      orderStatus: "paid",
    });
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    session.purchasedCourses = [...session.purchasedCourses, ...session.cart];
    session.cart = [];
    await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

    return res.json({ message: "Order Completed", status: "success" });
  }
  res.status(400).json({ error: "Order not completed", status: "failed" });
});

app.listen(4000, () => {
  console.log("Server started");
});
