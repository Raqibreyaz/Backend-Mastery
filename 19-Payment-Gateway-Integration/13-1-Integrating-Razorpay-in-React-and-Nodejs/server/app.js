import express from "express";
import Razorpay from "razorpay";
import cors from "cors";

const app = express();

const rzp = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/*
- create an order
- returns 
   - razorpay api_key
   - order_id
   - customer_name,email,contact
   - notes object
   - theme
   - currency
  to frontend
*/
app.post("/create", async (req, res, next) => {
  const amount = req.body.amount;
  const currency = "INR";
  const notes = {
    product: "banarasi saree",
  };
  const theme = "#3399c";
  const prefill = {
    name: "Raquib Reyaz",
    email: "raquib@raquib.com",
    contact: "+919876543210",
  };

  const order = await rzp.orders.create({
    amount: amount * 100,
    currency,
    notes,
    customer_details: prefill,
  });

  res.json({
    currency,
    notes,
    prefill,
    theme,
    order_id: order.id,
    api_key: process.env.RZP_KEY_ID,
  });
});

app.listen(4000, () => {
  console.log("server is running at port 4000");
});
