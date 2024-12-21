import React, { useEffect, useState } from "react";
import { useCustomTheme } from "../hooks/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { PasswordReset } from "../redux/auth/authSlice";
import { LazyImage } from "../components";
import trasparentLogo from "../images/apple-touch-icon.png";
import { BeatLoader } from "react-spinners";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [AccentColor, setAccentColor] = useState<string>("");
  const { tenantTheme } = useCustomTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (tenantTheme?.colors.accent) {
      setAccentColor(tenantTheme.colors.accent);
    } else {
      setAccentColor("#3b82f6");
    }
  }, [tenantTheme]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email) {
      try {
        await dispatch(PasswordReset(email)).unwrap();
        setEmail("");
      } catch (err: unknown) {
        console.error("Password reset failed:", err);
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-darkBackground">
      <div className="mt-32 p-8 max-w-md w-full">
        <div className="flex justify-center">
          <LazyImage
            src={tenantTheme?.background_image || trasparentLogo}
            alt="logo"
            className="w-16"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-darkText mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-darkText"
            >
              Enter your email address{" "}
              <span className="text-sm ml-1" style={{ color: AccentColor }}>
                *
              </span>
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
              style={{ borderColor: AccentColor }}
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              backgroundColor: AccentColor,
            }}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader size={10} color="#fff" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500">
            {error || "An error occurred. Please try again."}
          </p>
        )}

        <div className="text-center mt-4">
          <a
            href="/login"
            className="text-sm dark:text-gray-300 text-darkBackground200 hover:underline flex items-center justify-center"
          >
            <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
            <span className="mx-2">Log in</span>
            <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
