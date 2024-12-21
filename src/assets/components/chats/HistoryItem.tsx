import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setChatId } from "./../../redux/chats/chatSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface Chat {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  chat_id: string;
  author: number;
}

interface ChatHistoryItemProps {
  chat: Chat;
  onDelete: (chat: Chat) => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  chat,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDelete = () => {
    onDelete(chat);
    setIsDropdownOpen(false);
  };

  const openChat = () => {
    Cookies.remove("chat_id");
    Cookies.remove("user_id");
    console.log(`Opening chat: ${chat.chat_id}`);
    Cookies.set("chat_id", chat.chat_id);
    navigate(`/chat/${chat.chat_id}`);
    window.location.reload();
    dispatch(setChatId(chat.chat_id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <article
      className="relative flex items-center justify-between mb-1 px-3 py-2 rounded-md hover:dark:bg-slate-600 hover:bg-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-200"
      role="button"
      tabIndex={0}
      aria-label={`Chat item: ${chat.title}`}
      onClick={openChat}
    >
      <div className="max-w-[200px]">
        <p className="text-sm truncate">{chat.title}</p>
      </div>

      <button
        className="text-xs ml-2 focus:outline-none"
        aria-label={`Options for ${chat.title}`}
        onClick={(event) => {
          event.stopPropagation();
          toggleDropdown();
        }}
        title="Options"
      >
        <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full -mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg w-40 z-50"
          style={{
            transform: "translate(-12%, 0)",
          }}
        >
          <ul className="py-1">
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
              onClick={handleDelete}
            >
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="mr-2 text-red-500"
              />
              Delete
            </li>
          </ul>
        </div>
      )}
    </article>
  );
};

export default ChatHistoryItem;
