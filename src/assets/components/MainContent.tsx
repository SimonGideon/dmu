import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  setSession,
  clearSession,
  SESSION_CHECK_INTERVAL_MS,
  startSessionCheck,
} from "./../utils/sessionManager";
import {
  Modal,
  ActionSplash,
  ChatOutput,
  PromptLibraries,
} from "./../components";
import { initializeChatData } from "../redux/chats/chatSlice";
import { isAuthenticated } from "./../utils/authUtils";
import { useDispatch } from "react-redux";
import { deleteCookie, getCookie, anonymousDisposal } from "../utils/helper";
import { AppDispatch } from "./../redux/store";
import { webSocketURL } from "../redux/api";
import { useWebSocketHelper } from "../hooks";
import ChatInput from "../components/chats/ChatInput";

interface MainContentProps {
  authChatId?: string;
}
const MainContent: React.FC<MainContentProps> = ({ authChatId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeChatId = authChatId;

  const handlePromptClick = async (prompt: string) => {
    try {
      deleteCookie("chat_id");
      await dispatch(initializeChatData());
      const chat_id = getCookie("chat_id");

      if (chat_id) {
        navigate(`/chat/${chat_id}`);
        window.location.reload();
      } else {
        console.error("Chat ID not initialized");
      }

      sendMessageToChat(prompt, [], "text");
    } catch (error) {
      console.error("Error during chat initialization:", error);
    }
  };

  useEffect(() => {
    anonymousDisposal();
  }, []);

  const anonymousId = getCookie("anonymousid");
  const chatId = getCookie("chat_id");
  const accessToken = getCookie("access_token");
  let WS_URL = "";
  if (!isAuthenticated() && anonymousId && chatId) {
    WS_URL = `${webSocketURL}${chatId}/?anonymousid=${anonymousId}`;
  } else if (isAuthenticated() && activeChatId) {
    WS_URL = `${webSocketURL}${activeChatId}/?token=${accessToken}`;
  }

  const { messages, sendMessage, readyState, isThinking, SendFeedback } =
    useWebSocketHelper(WS_URL);

  const sendMessageToChat = async (
    inputedValue: string,
    files: Array<{ name: string; type: string; content: string }>,
    messageType: string
  ) => {
    if (!isAuthenticated()) {
      await dispatch(initializeChatData());
    }
    if (!chatId) {
      const res = await dispatch(initializeChatData());
      if (res.payload && typeof res.payload !== "string") {
        navigate(`/chat/${res.payload.chat_id}`);
      }
    }
    // alert("message: " + inputedValue + " files: " + files);
    const { anonymousid, chat_id } = Cookies.get();
    if ((anonymousid && chat_id) || (isAuthenticated() && chat_id)) {
      sendMessage(inputedValue, files, messageType);
    } else {
      console.warn("Chat is not initialized yet. Cannot send message.");
    }
  };

  const sendMessageFeedback = async (
    rating: number,
    feedback: string,
    message_id: number
  ) => {
    if (!isAuthenticated()) {
      await dispatch(initializeChatData());
    }
    if (!chatId) {
      const res = await dispatch(initializeChatData());
      if (res.payload && typeof res.payload !== "string") {
        navigate(`/chat/${res.payload.chat_id}`);
      }
    }
    const { anonymousid, chat_id } = Cookies.get();
    if ((anonymousid && chat_id) || (isAuthenticated() && chat_id)) {
      SendFeedback(rating, feedback, message_id);
    } else {
      console.warn("Chat is not initialized yet. Cannot send message.");
    }
  };

  useEffect(() => {
    console.log("Ready state: ", readyState);
  }, [messages, readyState]);

  const handleSessionExpired = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      setSession();
      const sessionCheckInterval = startSessionCheck(
        SESSION_CHECK_INTERVAL_MS,
        handleSessionExpired
      );
      return () => {
        clearInterval(sessionCheckInterval);
      };
    }
  }, [handleSessionExpired]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    clearSession();
    setSession();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log("Files selected: ", files);
    }
  };

  console.log("Thinking: ", isThinking);

  return (
    <main
      className="flex flex-col items-center justify-center flex-grow px-5 md:px-4"
      id="main-content"
    >
      <div className="mb-5">
        <ChatOutput
          myChatFeedback={sendMessageFeedback}
          chatResponse={messages}
          thinking={isThinking}
        />
      </div>
      <ChatInput sendMessageToChat={sendMessageToChat} />
      <div className="flex flex-wrap justify-center gap-4">
        {messages.length === 0 && (
          <PromptLibraries onPromptClick={handlePromptClick} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title=""
        body={<ActionSplash onClose={handleModalClose} />}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </main>
  );
};

export default MainContent;
