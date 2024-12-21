import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCogs,
  faSignOutAlt,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { isAuthenticated, logout } from "./../utils/authUtils";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../redux/theme/themeSlice";
import { RootState, AppDispatch } from "../redux/store";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tenantTheme, loading, error } = useSelector(
    (state: RootState) => state.theme
  );

  useEffect(() => {
    if (!tenantTheme && !loading && !error) {
      dispatch(fetchTheme());
    }
  }, [tenantTheme, loading, error, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center sm:p-1 sm:pr-6">
      {isAuthenticated() ? (
        <div className="flex items-center justify-end w-full">
          <div ref={profileRef} className="relative hidden md:block">
            <button
              onClick={togglePopup}
              className="text-lg font-bold text-text dark:text-darkText border border-gray-300 dark:border-gray-600 rounded-full px-2 py-[2px]"
              aria-expanded={isPopupOpen ? "true" : "false"}
              aria-controls="user-menu"
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
            {isPopupOpen && (
              <div
                id="user-menu"
                className="absolute right-0 mt-2 w-48 bg-slate-50 border border-stone-200 dark:bg-darkBackground200 shadow-lg rounded-lg py-2 dark:border-slate-700"
                role="menu"
                aria-labelledby="profile-button"
              >
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-[0.5px] border-stone-200 dark:border-slate-700"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-3" />
                  Settings
                </Link>
                <Link
                  to=""
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                  Log out
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden ml-4">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="cursor-pointer text-xl text-slate-200"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full p-3">
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-0">
            {tenantTheme && tenantTheme.name}
          </div>
          <div className="flex items-center">
            <button className="text-secondary mr-4 sm:mr-6">
              <Link to="/login">Log in</Link>
            </button>
            <button className="dark:bg-white bg-darkBackground text-white dark:text-text px-4 py-2 rounded-[20px] mr-4 sm:mr-6">
              <Link to="/sign-up">Sign up</Link>
            </button>
            <button
              onClick={toggleTheme}
              className="bg-secondary text-text px-3 py-2 rounded-full md:px-5 hidden"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
