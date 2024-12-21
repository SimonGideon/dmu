/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import trasparentLogo from "../images/apple-touch-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { useCustomTheme } from "../hooks/ThemeContext";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [AccentColor, setAccentColor] = useState<string>("");
  const { tenantTheme } = useCustomTheme();
  const { loading, userData } = useSelector(
    (state: RootState) => state.auth
  ) as {
    loading: boolean;
    userData: { user_id?: string; access_token?: string } | null;
    error: string | null;
  };

  useEffect(() => {
    if (tenantTheme && tenantTheme.colors.accent) {
      setAccentColor(tenantTheme.colors.accent);
    } else {
      setAccentColor("#3b82f6");
    }
  }, [tenantTheme]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === "firstName" || name === "lastName") {
        newData.name = `${newData.firstName} ${newData.lastName}`.trim();
      }
      return newData;
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, confirmPassword, name } = formData;

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(registerUser({ name, email, password, confirmPassword }))
      .unwrap()
      .then(() => {
        return;
      })
      .catch((err) => {
        toast.error(`An error occurred: ${err}`);
      });
  };

  useEffect(() => {
    console.log("User data:", userData);
    if (userData) {
      if (userData.user_id) {
        toast.success(
          "Account created successfully! Please check your email for verification instructions."
        );
        navigate("/verify-otp");
      } else if (userData.access_token) {
        toast.success("Account exists Loging in!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    }
  }, [userData, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-darkBackground">
      <div className="p-8 w-full max-w-lg">
        <div className="flex justify-center">
          <img
            src={tenantTheme?.background_image || trasparentLogo}
            alt="logo"
            className="w-16"
          />
        </div>
        <h2 className="text-2xl font-bold text-center dark:text-gray-300 mb-4">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium dark:text-gray-300 text-darkBackground200"
              >
                First Name{" "}
                <span className="text-sm ml-1" style={{ color: AccentColor }}>
                  *
                </span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                style={{ borderColor: AccentColor }}
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium dark:text-gray-300 text-darkBackground200"
              >
                Last Name{" "}
                <span className="text-sm ml-1" style={{ color: AccentColor }}>
                  *
                </span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                style={{ borderColor: AccentColor }}
              />
            </div>
          </div>
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
          <div className="flex gap-3 mb-4">
            <div className="w-1/2 relative">
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
            <div className="w-1/2 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium dark:text-gray-300 text-darkBackground200"
              >
                Confirm Password{" "}
                <span className="text-sm ml-1" style={{ color: AccentColor }}>
                  *
                </span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                style={{ borderColor: AccentColor }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ backgroundColor: AccentColor }}
          >
            {loading ? <BeatLoader size={10} color="#fff" /> : "Sign Up"}
          </button>
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
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
