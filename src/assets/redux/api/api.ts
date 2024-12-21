import axios from "axios";
import Cookies from "js-cookie";
import { getSubdomain } from "../../utils/handleTheme";

const { subdomain, staging } = getSubdomain();
let baseURL: string;
export let webSocketURL: string;
export let hostDomain: string;

if (subdomain === "local") {
  baseURL = "https://rubyapi.staging.xeai.uk/api/v1/";
  webSocketURL = "wss://rubyapi.staging.xeai.uk/ws/chat/";
  hostDomain = "https://rubyapi.staging.xeai.uk";
} else if (!staging) {
  baseURL = `https://${subdomain}api.staging.xeai.uk/api/v1/`;
  webSocketURL = `wss://${subdomain}api.staging.xeai.uk/ws/chat/`;
  hostDomain = `https://${subdomain}api.staging.xeai.uk`;
} else {
  baseURL = `https://askbal.api.staging.xeai.uk/api/v1/`;
  webSocketURL = `wss://askbal.api.staging.xeai.uk/ws/chat/`;
  hostDomain = `https://askbal.api.staging.xeai.uk`;
}

// console.log(baseURL);
// console.log(webSocketURL);
// console.log("This is the host domain" + hostDomain);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.error("Error setting headers:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// export const refreshAccessToken = async (
//   refreshToken: string
// ): Promise<string | null> => {
//   try {
//     const response = await fetch(`${baseURL}auth-refresh/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         accept: "application/json",
//       },
//       body: JSON.stringify({ refresh: refreshToken }),
//     });

//     if (!response.ok) throw new Error("Failed to refresh token");

//     const data = await response.json();
//     Cookies.set("access_token", data.access, { secure: true, httpOnly: false });
//     Cookies.set("refresh_token", data.refresh, {
//       secure: true,
//       httpOnly: false,
//     });
//     return data.access;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// };

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await api.post("refresh-token/", {
          refresh: refreshToken,
        });
        const { access, refresh } = response.data;

        Cookies.set("access_token", access, { secure: true, httpOnly: false });
        Cookies.set("refresh_token", refresh, {
          secure: true,
          httpOnly: false,
        });

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // console.error("Token refresh failed:", refreshError);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
