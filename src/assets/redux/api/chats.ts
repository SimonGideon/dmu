/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import Cookies from "js-cookie";
import { isAuthenticated } from "./../../utils/authUtils";

const MAX_RETRIES = 5; // Maximum number of retry attempts
const INITIAL_RETRY_DELAY = 1000; // Initial delay in milliseconds (1 second)
export const initializeChat = async (): Promise<{
  anonymousid?: string;
  chat_id: string;
  user_id?: string;
}> => {
  const existingAnonymousId = Cookies.get("anonymousid");
  const existingChatId = Cookies.get("chat_id");
  const existingUserId = Cookies.get("user_id");

  // Return if chat is already initialized
  if (existingAnonymousId && existingChatId) {
    return { anonymousid: existingAnonymousId, chat_id: existingChatId };
  }

  let attempts = 0;
  let delay = INITIAL_RETRY_DELAY;

  while (attempts < MAX_RETRIES) {
    try {
      // If not authenticated, initialize as anonymous
      if (!isAuthenticated()) {
        const response = await api.post("initialize/");
        const { anonymousid, chat_id } = response.data;
        Cookies.set("anonymousid", anonymousid);
        Cookies.set("chat_id", chat_id);
        return { anonymousid, chat_id };
      }

      // If authenticated, initialize with user details
      if (isAuthenticated()) {
        Cookies.remove("user_id");
        const response = await api.post("initialize/");
        const { chat_id, user_id } = response.data;
        Cookies.set("chat_id", chat_id);
        Cookies.set("user_id", user_id);
        // console.log("Chat initialized with user:", user_id);
        return { user_id, chat_id };
      }

      // Return early if already initialized
      return { user_id: existingUserId || "", chat_id: existingChatId || "" };
    } catch (error: any) {
      attempts += 1;
      const isLastAttempt = attempts === MAX_RETRIES;
      const errorMessage =
        error.response?.data?.detail ||
        "An error occurred while initializing chat data.";
      return errorMessage;
      // console.error(`Attempt ${attempts} failed: ${errorMessage}`);

      if (isLastAttempt) {
        throw new Error("Failed to initialize chat after multiple attempts.");
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));

      delay *= 2;
    }
  }

  throw new Error("Unexpected error during chat initialization.");
};

export const revokeInitialChat = async () => {
  Cookies.remove("anonymousid");
  Cookies.remove("chat_id");
  return;
};

export const deleteChat = async (chat_id: string) => {
  try {
    const response = await api.delete(`chats/delete-by-chat_id/${chat_id}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || "An error occurred while deleting chat."
    );
  }
};

export const fetchChatHistory = async () => {
  try {
    const response = await api.get("chats/");
    const filteredData = response.data.filter(
      (chat: any) => chat.deleted_flag === "No"
    );
    return filteredData;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
        "An error occurred while fetching chat history."
    );
  }
};
