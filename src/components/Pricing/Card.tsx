import { useState } from "react";
import { useNavigate } from "react-router-dom";
import initialisePayment from "../../scripts/payments/initialisePayment";

interface Props {
  type: string;
  price: number;
  features: string[];
  priceID: string;
}

function Card({ type, price, features, priceID }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
        const paymentUrl = await initialisePayment(
            priceID,
            () => navigate("/sign-in"),
            () => navigate("/dashboard")
        );
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    } catch (error) {
        console.error("Subscription error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl shadow-lg shadow-accent border-accent border-4 p-8 flex flex-col space-y-4 items-center bg-bgLight">
      <span className="rounded-full text-white bg-primary p-3 py-1 text-sm w-min font-semibold">
        {type}
      </span>
      <h2 className="text-7xl font-bold">${price}</h2>
      <p className="text-xl font-bold">billed monthly</p>
      <ul>
        {features.map((feature) => (
          <li className="flex space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="w-full bg-accent p-2 rounded-xl text-white font-bold hover:brightness-90 transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          "Buy Now"
        )}
      </button>
    </div>
  );
}

export default Card;
