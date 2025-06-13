import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function refreshAccessToken(navigate: (dest: string) => void) {
    const refreshToken = Cookies.get('refreshToken');
    console.log("refreshing")
    
    return await fetch(`${API_BASE}/api/token/refresh`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else if (response.status == 401) {
            Cookies.remove("refreshToken")
            Cookies.remove("accessToken")
            navigate("/sign-in")
            throw new Error("Refresh Token Unauthorised");            
        } else {
            throw new Error("Network problem");            
        }
    }).then(data => {
        Cookies.set('accessToken', data.token, {
            expires: 1/24, // 1 hour
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
        console.log("set successfully")
        return data;
    });
}

export default refreshAccessToken;