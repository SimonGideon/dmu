import React from "react";
import spaceImage from "../images/space.png";
const ErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
        <div>
            <img src={spaceImage} alt="space" className="h-40 w-40 mb-5" />
        </div>
        <span className="text-5xl font-bold text-gray-800 dark:text-gray-200">OOPS!</span>
      <h1 className="text-2xl font-bold"> Something went wrong!</h1>
      <p>The page you are looking for doesn't exist. Please try again later !</p>
    </div>
  );
};

export default ErrorPage;
