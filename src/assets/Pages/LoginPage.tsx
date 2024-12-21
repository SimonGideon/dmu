/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import trasparentLogo from "../images/apple-touch-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { useCustomTheme } from "../hooks/ThemeContext";
import { LazyImage, GoogleLoginButton } from "../components";

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [AccentColor, setAccentColor] = useState<string>("");
  const { tenantTheme } = useCustomTheme();
  const { loading, error } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    if (tenantTheme && tenantTheme.colors.accent) {
      setAccentColor(tenantTheme.colors.accent);
    } else {
      setAccentColor("#3b82f6");
    }
  }, [tenantTheme]);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in both fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const action = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(action)) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else {
        const errorMessage = error || "An unknown error occurred.";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message || err}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-darkBackground">
      <div className="p-8 w-full max-w-sm">
        <div className="flex justify-center">
          <LazyImage
            src={tenantTheme?.background_image || trasparentLogo}
            alt="logo"
            className="w-16"
          />
          {/* <img src={tenantTheme?.background_image || trasparentLogo} alt="logo" className="w-16" /> */}
        </div>
        <h2 className="text-2xl font-bold text-center dark:text-gray-300 mb-4">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium dark:text-gray-300 text-darkBackground200"
            >
              Email{" "}
              <span className="text-sm ml-1" style={{ color: AccentColor }}>
                *
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
              style={{ borderColor: AccentColor }}
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium dark:text-gray-300 text-darkBackground200"
            >
              Password{" "}
              <span className="text-sm ml-1" style={{ color: AccentColor }}>
                *
              </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
              style={{ borderColor: AccentColor }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{
              backgroundColor: AccentColor,
            }}
          >
            {loading ? <BeatLoader size={10} color="#fff" /> : "Log In"}
          </button>
          <div>
            <GoogleLoginButton />
          </div>
          <div className="text-center mt-4">
            <a
              href="/reset-password"
              className="text-sm dark:text-gray-300 text-darkBackground200 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm dark:text-gray-300 text-darkBackground200">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                style={{ color: AccentColor }}
                className="font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
