/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import Cookies from "js-cookie";
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("login/", {
      email,
      password,
    });

    const { access, refresh, user } = response.data;
    Cookies.set("access_token", access, { expires: 1 });
    Cookies.set("refresh_token", refresh, { expires: 30 });

    Cookies.set("user", JSON.stringify(user));

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during login. Please try again later.";
    throw new Error(errorMessage);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  try {
    const response = await api.post("signup/", {
      name,
      email,
      password,
      password_confirmation,
    });
    if (response.data.user_id) {
      Cookies.set("user_id", response.data.user_id);
    } else if (response.data.access_token) {
      Cookies.set("access_token", response.data.access_token);
      Cookies.set("refresh_token", response.data.refresh_token);
    }
    // console.log("Repsonse data:", response.data);
    return response.data;
  } catch (error: any) {
    // console.error("Error during registration:", error);
    // console.log("Error response:", error.response);
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during registration. Please try again later.";
    throw new Error(errorMessage);
  }
};

export const OtpVerification = async (otp: string) => {
  const user_id = Cookies.get("user_id");
  try {
    const response = await api.post("verify-otp/", {
      otp,
      user_id,
    });
    Cookies.set("access_token", response.data.access);
    Cookies.set("refresh_token", response.data.refresh);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during OTP verification. Please try again later.";
    throw new Error(errorMessage);
  }
};

export const logout = async (refresh_token: string) => {
  try {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    Cookies.remove("chat_id");
    const response = await api.post("logout/", { refresh_token });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during logout. Please try again later.";
    throw new Error(errorMessage);
  }
};

export const googleLogin = async (token: string) => {
  try {
    const response = await api.post("auth-google/", { token });
    Cookies.set("access_token", response.data.access, { expires: 1 });
    Cookies.set("refresh_token", response.data.refresh, { expires: 30 });
    Cookies.set("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during Google login. Please try again later.";
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await api.post("password-reset/", { email });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      "An error occurred during password reset. Please try again later.";
    throw new Error(errorMessage);
  }
};
