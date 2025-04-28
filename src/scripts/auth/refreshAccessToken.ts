import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function refreshAccessToken() {
    const refreshToken = Cookies.get('refreshToken');
    
    return fetch(`${API_BASE}/api/token/refresh`, {
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
        } else {
            throw new Error("Network problem");            
        }
    }).then(data => {
        Cookies.set('accessToken', data.token, {
            expires: 1/24, // 1 hour
            secure: true,
            sameSite: 'strict'
        });
        return data;
    });
}

export default refreshAccessToken;