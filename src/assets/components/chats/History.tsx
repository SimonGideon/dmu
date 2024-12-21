import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faPenToSquare,
  faBars,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import HistoricItem from "./HistoricItems";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { chartHistory } from "../../redux/chats/chatSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { groupChatsByDate } from "../../utils/chatHistoryTime";
import { initializeChatData } from "../../redux/chats/chatSlice";
import { deleteCookie, getCookie } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const History: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const { history, loading, error } = useSelector(
    (state: RootState) => state.chat
  );

  const [loaderColor, setLoaderColor] = useState<string>("gray");

  useEffect(() => {
    const updateLoaderColor = () => {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setLoaderColor(isDarkMode ? "white" : "gray");
    };
    updateLoaderColor();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateLoaderColor);

    return () => mediaQuery.removeEventListener("change", updateLoaderColor);
  }, []);
  useEffect(() => {
    dispatch(chartHistory());
  }, [dispatch]);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prevState) => !prevState);
  };
  const groupedChats = groupChatsByDate(history);

  const handleNewChat = async () => {
    deleteCookie("chat_id");
    await dispatch(initializeChatData());
    const chat_id = getCookie("chat_id");

    if (chat_id) {
      navigate(`/chat/${chat_id}`);
      window.location.reload();
    } else {
      console.error("Chat ID not initialized");
    }
  };

  return (
    <div>
      <div className="md:hidden absolute">
        <div className="flex justify-between items-center p-5 pl-2 text-lg">
          <FontAwesomeIcon
            icon={faBars}
            onClick={toggleSidebar}
            className="cursor-pointer w-10 h-6"
          />
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <div className="absolute top-0 left-0 w-64 bg-slate-100 dark:bg-darkBackground200 dark:text-slate-200 shadow-lg z-50">
            <div className="flex justify-between items-center p-4">
              <FontAwesomeIcon icon={faTableColumns} />
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={toggleSidebar}
                className="cursor-pointer"
              />
            </div>
            <div className="">
              {loading ? (
                <div className="flex justify-center">
                  <FadeLoader height={8} width={2} color={loaderColor} />
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <HistoricItem groupedChats={groupedChats} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden bg-slate-100 dark:bg-darkBackground200 dark:text-slate-200 md:block position-fixed min-h-[120vh]">
        <div className="flex justify-between items-center p-5 text-lg">
          <FontAwesomeIcon icon={faTableColumns} />
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div
          className="mx-7 mb-2 justify-between font-medium  flex items-center gap-3 px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-base text-slate-800 dark:text-slate-200 shadow-md hover:bg-slate-300 dark:hover:bg-slate-500 cursor-pointer transition-all"
          onClick={handleNewChat}
        >
          New Chat
          <FontAwesomeIcon icon={faPlus} />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <FadeLoader height={8} width={2} color={loaderColor} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <HistoricItem groupedChats={groupedChats} />
        )}
      </div>
    </div>
  );
};

export default History;
