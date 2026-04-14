import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "./SessionContext";
import api from "./api";

export default function CheckoutProcess({ onClose, totalAmount }) {
  const { session, fetchSession } = useContext(SessionContext);
  const navigate = useNavigate();
  
  // Step 1: Check info
  const hasInfo = session?.userEmail && session?.userMobile && session?.userName;
  const [step, setStep] = useState(hasInfo ? "PAYMENT" : "EMAIL");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const razorPayScript = document.querySelector("#razorpay-script");
    if (razorPayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-script";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Invalid email");
    setLoading(true);
    try {
      await api.post("/send-otp", { email });
      setStep("OTP");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6 || name.trim().length < 2 || mobile.length !== 10) {
      return setError("Invalid details. OTP must be 6 digits, mobile 10 digits.");
    }
    setLoading(true);
    try {
      await api.put("/update-contact-info", { otp, name, mobile });
      await fetchSession(); // Update session with new info
      setStep("PAYMENT");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const initPayment = async () => {
    setLoading(true);
    setError("");
    try {
      // Create order first
      const { data } = await api.post("/create-order");
      if (data.error) throw new Error(data.error);

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        name: "ProCodrr LMS",
        description: "Course Purchase",
        prefill: data.prefill,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/complete-order", {
              orderId: response.razorpay_order_id,
            });
            if (verifyRes.data.status === "success") {
              await fetchSession();
              alert("Payment Successful!");
              onClose();
              navigate("/");
            } else {
              alert("Order not completed");
            }
          } catch (err) {
            alert("Error verifying payment");
          }
        },
      });
      rzp.on("payment.failed", (res) => alert("Payment failed"));
      rzp.open();
    } catch (err) {
      setError(err.message || err.response?.data?.error || "Error initializing payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "PAYMENT" && hasInfo) {
      // Only auto-trigger payment if they came into the modal with info, 
      // or button triggers it. Actually we should provide a button since auto-popups might be blocked.
      // Doing it via a button is safer.
    }
  }, [step, hasInfo]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === "EMAIL" && "Contact Email"}
            {step === "OTP" && "Verify Details"}
            {step === "PAYMENT" && "Finalize Payment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          {step === "EMAIL" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@email.com"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">OTP sent to {email}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                <input
                  type="text"
                  maxLength="10"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="9876543210"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          )}

          {step === "PAYMENT" && (
            <div className="space-y-6">
              <div className="text-center text-gray-700 dark:text-gray-300">
                <p>Total amount to pay:</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">₹{totalAmount}</p>
              </div>
              <button
                onClick={initPayment}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg disabled:opacity-50 transition-colors"
              >
                {loading ? "Initializing..." : "Pay Now"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
