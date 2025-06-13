import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function refreshAccessToken(navigate: (dest: string) => void) {
    const refreshToken = Cookies.get('refreshToken');
    
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
        } else if (response.status == 500) {
            alert("Internal Error Occured. Please try again later.")
            navigate("/")
            throw new Error("Internal Error Occured");            
        
        } else {
            alert("Something went wrong. Please try again later.")
            navigate("/")
            throw new Error("Unexpected Response recieved");            
        }
    }).then(data => {
        Cookies.set('accessToken', data.token, {
            expires: 1/24, // 1 hour
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
        return data;
    }).catch;
}

export default refreshAccessToken;