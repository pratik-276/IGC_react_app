import Axios from "axios";
const api = process.env.REACT_APP_API_KEY;

export default function call({ path, method, data }) {
  // const token = localStorage.getItem("accessToken");
  const token = localStorage.getItem("token");

  return new Promise((resolve, reject) => {
    const config = {
      url: api + path,
      method,
      data,
    };

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
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
