import Cookies from "js-cookie";

export default function logout() {
    Cookies.remove("accessToken")
}