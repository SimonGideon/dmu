import React, { useState, useEffect, useRef } from "react";
import { useCustomTheme } from "../hooks/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { RootState, AppDispatch } from "../redux/store";
import { verifyOtp } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [accentColor, setAccentColor] = useState<string>("#3b82f6");
  const { tenantTheme } = useCustomTheme();
  const { loading, userData } = useSelector(
    (state: RootState) => state.auth
  ) as { loading: boolean; userData: { access: boolean } };
  const dispatch = useDispatch<AppDispatch>();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (tenantTheme && tenantTheme.colors.accent) {
      setAccentColor(tenantTheme.colors.accent);
    } else {
      setAccentColor("#3b82f6");
    }
  }, [tenantTheme]);

  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData?.getData("Text") || "";
    if (/^\d{6}$/.test(clipboardData)) {
      setOtp(clipboardData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  useEffect(() => {
    const pasteHandler = (e: Event) => handlePaste(e as ClipboardEvent);
    document.addEventListener("paste", pasteHandler as EventListener);
    return () => {
      document.removeEventListener("paste", pasteHandler as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setIsValid(false);
      triggerWaveAnimation();
      return;
    }

    try {
      const result = await dispatch(verifyOtp(enteredOtp)).unwrap();
      if (result) {
        setIsValid(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsValid(false);
      triggerWaveAnimation();
      toast.error(err || "Invalid OTP, please try again.");
    }
  };

  useEffect(() => {
    if (isValid === true && userData?.access) {
      toast.success("OTP Verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      // Cookies.remove("user_id");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      // navigate("/login");
    }
  }, [isValid, navigate, userData?.access]);

  const triggerWaveAnimation = () => {
    inputRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.style.animation = `wave 0.5s ${i * 0.1}s ease-out`;
        ref.addEventListener("animationend", () => {
          ref.style.animation = "";
        });
      }
    });
  };

  const resendOtp = () => {
    // Placeholder for resend OTP functionality
    toast.info("OTP has been resent to your registered mobile/email.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-darkBackground">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg dark:bg-darkBackground200">
        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white mb-6">
          OTP Verification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el!)}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                maxLength={1}
                className={`w-12 h-12 border text-center text-xl rounded-md focus:outline-none focus:ring-2 ${
                  isValid === false ? "border-red-500" : "border-gray-300"
                } ${isValid === true ? "bg-green-100" : "bg-white"}`}
                style={{
                  borderColor: isValid === false ? "red" : "gray",
                  backgroundColor: isValid === true ? accentColor : "white",
                }}
              />
            ))}
          </div>

          {isValid === false && (
            <p className="text-red-500 text-sm text-center">
              Invalid OTP, please try again.
            </p>
          )}

          {isValid === true && (
            <p className="text-green-500 text-sm text-center">
              OTP Verified successfully!
            </p>
          )}

          <p className="text-sm text-center dark:text-white">
            Did not receive the OTP?{" "}
            <span
              className="font-semibold cursor-pointer"
              style={{ color: accentColor }}
              onClick={resendOtp}
            >
              Resend OTP
            </span>
          </p>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 text-white rounded-md hover:brightness-110 focus:outline-none"
              style={{
                backgroundColor: accentColor,
              }}
              disabled={loading}
            >
              {loading ? (
                <BeatLoader size={10} color="#fff" />
              ) : (
                "Verify & Proceed"
              )}
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          @keyframes wave {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default OtpVerification;
