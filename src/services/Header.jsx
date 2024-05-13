import Cookies from "universal-cookie";

export default function authHeader(headerType) {
    var cookie = new Cookies()
    const access_token = cookie.get('access_token')

    if (access_token) {
        // for Node.js Express back-end
        if (headerType === "") {
            return {
                Authorization: "Bearer " + access_token,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "X-Requested-With",
            };
        } else if (headerType === "multipart") {
            return {
                Authorization: "Bearer " + access_token,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "X-Requested-With",
                "Content-type": "multipart/form-data",
            };
        }
    } else {
        return {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "X-Requested-With",
        };
    }
}
