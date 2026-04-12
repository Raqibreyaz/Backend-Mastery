# **Understanding Orders in Razorpay**

In Razorpay, an **Order** is a server-side object that represents a payment you want to collect from a customer. It acts as a unique transaction identifier and is strongly recommended when integrating payments securely.

---

### 🔍 What is an Order in Razorpay?

An **Order** in Razorpay:

* Represents a payment you want to collect.
* Contains the amount, currency, receipt ID, and other metadata.
* Can be used to **track** the payment status (created, paid, failed, etc.).
* Links to the actual **Payment object** once payment is made.

---

### ⚖️ When Are Orders Created Automatically?

Orders are **automatically created** only in the following case:

* When you integrate Razorpay's **standard Checkout flow using backend SDKs (like Node.js SDK, or REST API)** and **you explicitly create an order before initiating the checkout.**

This is the **recommended flow**, especially for secure and trackable payments, such as:

* Course purchases
* Product payments
* Any backend-verified transaction

---

### ❌ When Are Orders NOT Created Automatically?

Orders are **not created** automatically in the following scenarios:

1. **Razorpay QR Code Payments**:

   * If the user scans a QR code and pays, no order object is created.
   * Only the payment object is generated.

2. **Frontend-only Checkout (No Backend)**:

   * If you directly embed the Razorpay Checkout using only JavaScript and pass the `amount`, `currency`, and other options in the `Razorpay` object without creating an order from the backend, the payment happens, but no order is created.
   * The payment is marked as **authorized** and must be manually captured unless auto-capture is enabled in settings.

---

### ✅ How to Create Orders Manually

You can **manually create an order** using:

1. **Razorpay Dashboard**: (Only visible under some conditions)

   * While the Orders list is visible, order creation from UI may not always be allowed manually.

2. **Razorpay API**:

   * Endpoint: `POST /v1/orders`
   * Requires API Key and Secret
   * Send parameters like amount, currency, and receipt ID.

3. **Razorpay Node.js SDK**:

   * Razorpay provides an official Node.js SDK.
   * You can create orders using the `razorpay.orders.create` method.

Creating an order ensures that you can:

* Track payment status more reliably
* Automatically capture payments
* Tie each payment to a specific transaction or receipt

---

### ℹ️ Summary

| Scenario                             | Is Order Created? | Notes                                    |
| ------------------------------------ | ----------------- | ---------------------------------------- |
| Payment via Razorpay QR Code         | No                | Only payment object is created           |
| Frontend-only Razorpay Checkout      | No                | Authorized payment, no order object      |
| Backend Razorpay SDK/API Integration | Yes               | Recommended and secure                   |
| Using Node.js SDK to create an order | Yes               | Offers full tracking and payment control |

---

**Best Practice:** Always create an Order from your backend (Node.js SDK or API) before showing the checkout to the user for secure, trackable, and auto-capturable payments.
