import { useState, useEffect } from "react";
import getAuthToken from "../../scripts/auth/getAuthToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface SubscriptionItem {
  period_start: number;
  period_end: number;
  product_code: string;
}

interface Subscription {
  canceled_at: number | null;
  items: {
    [key: string]: SubscriptionItem;
  };
}

interface SubscriptionResponse {
  active: {
    [key: string]: Subscription;
  };
}

export default function SubscriptionDetails() {
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingCancelId, setPendingCancelId] = useState<string>("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProductName = (code: string) => {
    const products: { [key: string]: string } = {
      basic: "Basic Plan",
      pro: "Pro Plan",
      enterprise: "Enterprise Plan",
    };
    return products[code] || code;
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setIsCanceling(true);
      const authToken = await getAuthToken();
      const response = await fetch(
        `${API_BASE}/api/payments/cancel_subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ subscriptionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Refresh subscription data
      await fetchSubscriptionDetails();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const fetchSubscriptionDetails = async (): Promise<void> => {
    try {
      const authToken = await getAuthToken();
      const response = await fetch(`${API_BASE}/api/payments/subscriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription details");
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const openCancelDialog = (subscriptionId: string) => {
    setPendingCancelId(subscriptionId);
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    await handleCancelSubscription(pendingCancelId);
    setShowConfirmDialog(false);
    setPendingCancelId("");
  };

  return (
    <div className="w-full bg-white rounded-xl border shadow-sm">
      <div className="rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Your Subscription</h2>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50">
            <p className="text-red-600 font-medium text-center">{error}</p>
          </div>
        )}

        {subscription &&
          Object.entries(subscription.active).map(([subId, sub]) => (
            <div key={subId} className="p-8">
              {Object.values(sub.items).map((item, index) => (
                <div key={index} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {getProductName(item.product_code)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            sub.canceled_at
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {sub.canceled_at ? "Canceling" : "Active"}
                        </span>
                      </div>
                      <p className="text-gray-600">Current billing period</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(item.period_start)} -{" "}
                        {formatDate(item.period_end)}
                      </p>
                    </div>
                  </div>

                  {sub.canceled_at ? (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-red-700 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Subscription will end on {formatDate(item.period_end)}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => openCancelDialog(subId)}
                      className="w-full md:w-auto px-6 py-3 bg-white border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Cancel Subscription</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}

        {subscription && Object.keys(subscription.active).length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No active subscriptions found.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll continue
              to have access until the end of your current billing period.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isCanceling ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
