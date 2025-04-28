import getAuthToken from "../auth/getAuthToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function initialisePayment(priceID: string, onUnauthorized?: () => void, onBadRequest?: () => void) {
    const authToken = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE}/api/payments/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                priceId: priceID
            })
        });

        if (!response.ok) {
            if (response.status === 401 && onUnauthorized) {
                onUnauthorized();
                return;
            } else if (response.status === 409 && onBadRequest) {
                onBadRequest();
                return;
            }
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.url;

    } catch (error) {
        console.error('Payment initialization error:', error);
        throw error;
    }
}

export default initialisePayment;