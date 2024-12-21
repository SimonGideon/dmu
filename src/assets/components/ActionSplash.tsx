import React from 'react';
import {  useNavigate } from "react-router-dom";
interface ActionSplashProps {
  onClose: () => void;
}
const ActionSplash: React.FC<ActionSplashProps> = ({ onClose }) => {

 
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateAccount = () => {
    navigate('/sign-up');
  };

  const handleStayLoggedOut = () => {
    onClose();
  };


  return (
    <div className="flex flex-col gap-6 mx-5">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-gray-600 mt-2 dark:text-white">
          Log in or sign up to get smarter responses, upload files and images, and more.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="w-full py-2 px-4 rounded-full bg-black  dark:bg-white  dark:text-darkBackground200 text-white font-semibold hover:bg-opacity-90"
          onClick={handleLogin}
        >
          Log in
        </button>
        <button
          className="w-full py-2 px-4 rounded-full border border-gray-300 text-gray-700 dark:text-white hover:bg-gray-100 bg-opacity-5 hover:text-gray-700"
          onClick={handleCreateAccount}
        >
          Create new account
        </button>
        <button
          className="w-full py-2 px-4 text-sm text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-white underline"
          onClick={handleStayLoggedOut}
        >
          Stay logged out
        </button>
      </div>
    </div>
  );
};

export default ActionSplash;
