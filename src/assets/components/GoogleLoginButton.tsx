import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { googleLoginUser } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (!credential) {
      console.error("No credential returned from Google");
      return;
    }

    try {
      await dispatch(googleLoginUser(credential)).unwrap();
      toast.success("Google login successful!");
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    } catch (error: unknown) {
      console.error("Google login error:", error);
      toast.error(
        typeof error === "string" ? error : "Failed to log in with Google."
      );
    }
  };

  const handleError = () => {
    toast.error("Google login failed.");
    console.error("Google login failed");
  };

  return (
    <div className="google-login flex flex-col items-center gap-4 mt-4">
      <div className="flex items-center w-full">
        <div className="flex-grow  h-[0.5px] bg-gray-300"></div>
        <div className="mx-4 text-darkSecondary dark:text-gray-500 font-semibold">
          OR
        </div>
        <div className="flex-grow h-[0.5px] bg-gray-300"></div>
      </div>
      {loading ? (
        <BeatLoader size={10} color="#fff" />
      ) : (
        <div className="flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
