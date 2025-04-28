import refreshAccessToken from "./refreshAccessToken";
import Cookies from "js-cookie";

function getAuthToken() {
    const refreshToken = Cookies.get('refreshToken');
    let accessToken = Cookies.get('accessToken');
    if (!accessToken && refreshToken) {
        refreshAccessToken()
        accessToken = Cookies.get('accessToken');
    } else if (!accessToken && !refreshToken) {
        window.location.href = '/sign-in';
    }
    return accessToken
}

export default getAuthToken