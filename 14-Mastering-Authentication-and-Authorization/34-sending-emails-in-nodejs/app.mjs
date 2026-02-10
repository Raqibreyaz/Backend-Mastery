import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "rockstarr@gmail.com",
    pass: "<pass>",
  },
});

// Send an email using async/await

const info = await transporter.sendMail({
  from: '"Rockstar" <rockstarr@gmail.com>',
  to: "procodrr@gmail.com",
  subject: "Hello Nodejs Keeda",
//   text: "Hello world?", // Plain-text version of the message
  html: "<h2>Am currently studying Nodejs with you!</h2>", // HTML version of the message
});

console.log("Message sent:", info.messageId);
