const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const authToken = `Basic ${btoa(`${apiKey}:${apiSecret}`)}`;

console.log(authToken);

const res = await fetch("https://api.razorpay.com/v1/orders", {
  headers: {
    Authorization: authToken,
  },
});

const data = await res.json();
console.log(data);
