import refreshAccessToken from "./refreshAccessToken";
import Cookies from "js-cookie";

async function getAuthToken(navigate: (dest: string) => void) {
    const refreshToken = Cookies.get('refreshToken');
    let accessToken = Cookies.get('accessToken');
    if (!accessToken && refreshToken) {
        await refreshAccessToken(navigate)
        accessToken = Cookies.get('accessToken');
    } else if (!accessToken && !refreshToken) {
        navigate("/sign-in")
    }
    return accessToken
}

export default getAuthToken