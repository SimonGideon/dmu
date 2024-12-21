import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  LoginPage,
  ResetPasswordPage,
  ErrorPage,
  HomePage,
  SignUpPage,
  OtpVerification,
  ChatPage,
} from "./assets/Pages";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { useCustomTheme } from "./assets/hooks/ThemeContext";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/chat/:id",
    element: <ChatPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/chat",
    element: <HomePage />,
  },

  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/verify-otp",
    element: <OtpVerification />,
  },
]);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App: React.FC = () => {
  useCustomTheme();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
        <RouterProvider router={router} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
