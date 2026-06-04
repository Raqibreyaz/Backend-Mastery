import { useContext, useState } from "react";
import { Trash2 } from "lucide-react";
import { SessionContext } from "./SessionContext";
import CheckoutProcess from "./CheckoutProcess";
import api from "./api";
import { Link } from "react-router-dom";

export default function Cart() {
  const { session, courses, fetchSession, loading } = useContext(SessionContext);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [removing, setRemoving] = useState(null);

  if (loading) {
    return <div className="text-center text-white p-10">Loading cart...</div>;
  }

  const cartIds = session?.cart || [];
  const cartCourses = courses.filter((course) => cartIds.includes(course.id));
  const totalAmount = cartCourses.reduce((sum, course) => sum + course.price, 0);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await api.delete(`/cart/${id}`);
      await fetchSession();
    } catch (err) {
      alert("Failed to remove item.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Your Cart
      </h1>
      
      {cartCourses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Your cart is empty.</p>
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartCourses.map((course) => (
              <div key={course.id} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <img src={course.image} alt={course.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">₹{course.price}</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(course.id)}
                    disabled={removing === course.id}
                    className="self-start flex items-center text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {removing === course.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal ({cartCourses.length} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg pt-3 border-t border-gray-100 dark:border-gray-700">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button 
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutProcess onClose={() => setCheckoutOpen(false)} totalAmount={totalAmount} />
      )}
    </div>
  );
}
