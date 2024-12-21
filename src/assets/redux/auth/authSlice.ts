/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  OtpVerification,
  resetPassword,
} from "../api/authApi";
import { googleLogin } from "./../api/authApi";

interface authState {
  loading: boolean;
  error: string | null;
  userData: object | null;
}

const initialState: authState = {
  loading: false,
  error: null,
  userData: null,
};

export const logoutUser = createAsyncThunk(
  "login/logoutUser",
  async (refresh_token: string, { rejectWithValue }) => {
    try {
      await logout(refresh_token);
      return;
    } catch (error: any) {
      console.error("Logout error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await login(credentials.email, credentials.password);
      console.log(data);
      return data;
    } catch (error: any) {
      console.error("Login error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

export const registerUser = createAsyncThunk(
  "login/registerUser",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await register(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.confirmPassword
      );
      console.log("THis is the data on registration" + data);
      return data;
    } catch (error: any) {
      console.error("Register error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "login/verifyOtp",
  async (otp: string, { rejectWithValue }) => {
    try {
      const data = await OtpVerification(otp);
      console.log(data);
      return data;
    } catch (error: any) {
      console.error("OTP verification error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "login/googleLoginUser",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await googleLogin(token);
      console.log(data);
      return data;
    } catch (error: any) {
      console.error("Google login error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

export const PasswordReset = createAsyncThunk(
  "login/passwordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await resetPassword(email);
      console.log(data);
      return data;
    } catch (error: any) {
      console.error("Password reset error:", error.detail);
      return rejectWithValue(error.detail);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        console.log("This is the payload" + action.payload);
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userData = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(PasswordReset.pending, (state) => {
        state.loading = true;
      })
      .addCase(PasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(PasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
