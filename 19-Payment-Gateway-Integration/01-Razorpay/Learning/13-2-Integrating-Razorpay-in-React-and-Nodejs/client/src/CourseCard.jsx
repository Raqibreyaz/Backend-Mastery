import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "./SessionContext";
import api from "./api";

export default function CourseCard({
  id,
  name,
  price,
  image,
  setToastMessage,
}) {
  const { session, fetchSession } = useContext(SessionContext);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  // Check if course is already in the cart or purchased
  const inCart = session?.cart?.includes(id);
  const purchased = session?.purchasedCourses?.includes(id);

  const handleAction = async () => {
    if (purchased) {
      setToastMessage("You already own this course!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    if (inCart) {
      navigate('/cart');
      return;
    }

    // Add to cart
    setAdding(true);
    try {
      await api.post(`/cart/${id}`);
      setToastMessage("Added to cart!");
      await fetchSession(); // Refresh session to reflect cart changes
    } catch (err) {
      setToastMessage(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setTimeout(() => setToastMessage(""), 3000);
      setAdding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ₹{price}
          </span>
          <button
            onClick={handleAction}
            disabled={adding}
            className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-white ${
              purchased 
                ? "bg-green-600 hover:bg-green-700"
                : inCart ? "bg-gray-600 hover:bg-gray-700" : "bg-indigo-600 hover:bg-indigo-700"
            } ${adding ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span>
              {adding ? "Adding..." : purchased ? "Purchased" : inCart ? "Go to Cart" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
