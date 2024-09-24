import Axios from "axios";
// import Cookies from "universal-cookie";
//const api = process.env.REACT_APP_API_KEY;
const api = "https://13.127.147.33/";

export default function call({ path, method, data }) {
  // var cookie = new Cookies();
  // const access_token = cookie.get('access_token')
  const access_token = localStorage.getItem("access_token");

  return new Promise((resolve, reject) => {
    const config = {
      url: api + path,
      method,
      data,
    };

    if (access_token) {
      config.headers = { Authorization: `Bearer ${access_token}` };
    }

    Axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        let status = error?.response?.data?.status;
        let errorMessage =
          error?.response?.data?.message || "An error occurred.";

        if ([401, 403, 404].includes(status)) {
          reject(errorMessage);
        } else {
          reject(errorMessage);
        }
      });
  });
}
