import Cookies from "js-cookie";
import getAuthToken from "./getAuthToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function verifyAuthToken(navigate: (dest: string) => void) {
    const accessToken = await getAuthToken(navigate)

    fetch(`${API_BASE}/api/user/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.status == 401) {
            Cookies.remove("accessToken")
            navigate("/sign-in")
        }
    })
}

export default verifyAuthToken