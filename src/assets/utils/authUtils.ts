/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from "js-cookie";
import { logoutUser } from "../redux/auth/authSlice";

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get("access_token");
  // const user = Cookies.get("user");
  // const user_id = Cookies.get("user_id");

  if (!accessToken) return false;

  const decodedToken = decodeToken(accessToken);
  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken && decodedToken.exp < currentTime) {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
    // console.log("Token expired");
    return false;
  }

  // console.log("User is authenticated");
  return true;
};

export const logout = () => {
  const refreshToken = Cookies.get("refresh_token");
  if (refreshToken) {
    logoutUser(refreshToken);
  }
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user");
  window.location.href = "/";
};
