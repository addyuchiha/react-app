import getAuthToken from "../auth/getAuthToken"
import verifyAuthToken from "../auth/verifyAuthToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function checkActiveSubscription() {
    const accessToken = await getAuthToken()
    await verifyAuthToken()
    
    try {
        const response = await fetch(`${API_BASE}/api/user/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = "/sign-in"
            return false;
        }

        const data = await response.json();
        sessionStorage.setItem("user", JSON.stringify(data))
        return Boolean(data.subscriptionId);

    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}

export default checkActiveSubscription