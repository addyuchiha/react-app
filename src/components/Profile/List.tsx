import { useState, useEffect } from 'react';
import getAuthToken from "../../scripts/auth/getAuthToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface PaymentDetail {
    amount: number;
    createdAt: number;
    currency: string;
    invoiceUrl: string;
    number: string;
    status: string;
}

export default function List() {
    const [paymentsDetails, setPaymentsDetails] = useState<PaymentDetail[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Format currency based on locale and currency code
    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Convert timestamp to readable date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchPaymentDetails = async (): Promise<void> => {
            try {
                const authToken = await getAuthToken();
                const response = await fetch(`${API_BASE}/api/payments/details`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payment details');
                }

                const data = await response.json();
                setPaymentsDetails(data.payments);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentDetails();
    }, []);

    return (
        <div className="w-full bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}

            {error && (
                <div className="p-6 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            )}

            {paymentsDetails && (
                <div className="divide-y divide-gray-200">
                    {paymentsDetails.map((payment) => (
                        <div key={payment.number} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-medium text-gray-900">Invoice #{payment.number}</p>
                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                            payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">
                                        {formatAmount(payment.amount, payment.currency)}
                                    </p>
                                    <a 
                                        href={payment.invoiceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-1"
                                    >
                                        <span>Download Invoice</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {paymentsDetails?.length === 0 && (
                <div className="p-6 text-center">
                    <p className="text-gray-500">No payment history available.</p>
                </div>
            )}
        </div>
    );
}