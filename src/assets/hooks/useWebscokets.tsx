/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { isAuthenticated } from "./../utils/authUtils";
import { getCookie } from "../utils";

type WebSocketHelper = {
  messages: any[];
  sendMessage: (
    message: string,
    fileUpload: Array<object>,
    messageType: string
  ) => void;
  readyState: ReadyState;
  isThinking: boolean;
  DeleteMessage: (chat_id: string) => void;
  fetchMessages: () => void;
  SendFeedback: (rating: number, feedback: string, message_id: number) => void;
};

export const useWebSocketHelper = (wsUrl: string): WebSocketHelper => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const messageQueue = useRef<string[]>([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const isConnectedRef = useRef(false);

  const anonymousId = getCookie("anonymousid");
  const chatId = getCookie("chat_id");

  const shouldConnect = isAuthenticated() || (anonymousId && chatId);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    shouldConnect ? wsUrl : null,
    {
      share: false,
      shouldReconnect: () => {
        if (retryAttempts < 5) {
          setRetryAttempts((prev) => prev + 1);
          setIsThinking(true);
          // console.log(
          //   `WebSocket connection failed. Retry attempt: ${retryAttempts + 1}`
          // );
          return true;
        }

        // console.log("WebSocket reached maximum retry attempts (5).");
        return false;
      },
      onOpen: () => {
        // console.log("WebSocket opened successfully.");
        isConnectedRef.current = true;
        // console.log(wsUrl);
        if (isAuthenticated()) {
          sendJsonMessage({
            command: "fetch_messages",
          });
        }

        // Send only the last message in the queue once the WebSocket opens (LIFO)
        // if (!conversationStarted) {
        //   const lastMessage = messageQueue.current.pop();
        //   console.log("Sending last message from the queue:", lastMessage);
        //   if (lastMessage && lastMessage.trim() !== "") {
        //     sendJsonMessage({
        //       command: "new_message",
        //       message: lastMessage,
        //       type: messageType,
        //     });
        //   }
        //   setConversationStarted(true);
        //   messageQueue.current = [];
        // }

        setIsThinking(false);
        setRetryAttempts(0);
      },
      onClose: () => {
        // console.log("WebSocket closed, attempting to reconnect...");
        isConnectedRef.current = false;
        setIsThinking(false);
      },
    }
  );

  // Handle incoming messages
  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((prev) => [...prev, lastJsonMessage]);
      if (!conversationStarted) {
        // console.log("Conversation started.");
        setConversationStarted(true);
      }
    }
  }, [lastJsonMessage, conversationStarted]);

  const sendMessage = (
    message: string,
    fileUpload: Array<object>,
    messageType: string
  ) => {
    // console.log("Sending message:", message);
    // console.log("File upload:", fileUpload);
    if (!conversationStarted && message.trim() !== "") {
      messageQueue.current.push(message);
      // console.log("Message added to the queue:", message);
    } else {
      messageQueue.current = [];
    }

    // if (!shouldConnect) {
    //   console.warn("Cannot send message; WebSocket connection is not established.");
    //   return;
    // }

    setIsThinking(true);

    // console.log(`WebSocket readyState: ${readyState}`);

    if (readyState === ReadyState.OPEN) {
      // console.log("Sending message immediately:", message);
      if (fileUpload) {
        // console.log("This is the upload epic:", fileUpload);
        // console.log("This is the message type:", {
        //   message,
        //   files: fileUpload,
        //   type: messageType,
        // });
        sendJsonMessage({
          command: "new_message",
          message,
          files: fileUpload,
          type: messageType,
        });
      } else {
        sendJsonMessage({
          command: "new_message",
          message,
          type: messageType,
        });
      }
      setConversationStarted(true);
      setIsThinking(false);
      messageQueue.current = [];
    }
  };

  const fetchMessages = () => {
    if (!shouldConnect) {
      // console.warn(
      //   "Cannot fetch messages; WebSocket connection is not established."
      // );
      return;
    }

    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        command: "fetch_messages",
      });
    } else {
      // console.warn("Cannot fetch messages; WebSocket is not open.");
    }
  };

  // {
  //   "command": "submit_feedback",
  //   "rating": 1,  // 1 = Helpful, 0 = Not Helpful
  //   "feedback": "Good response.",
  //   "message_id": 3
  // }
  const SendFeedback = (
    rating: number,
    feedback: string,
    message_id: number
  ) => {
    console.log("Sending feedback:", rating, feedback, message_id);
    if (!conversationStarted && feedback.trim() !== "") {
      messageQueue.current.push(feedback);
      console.log("Feedback added to the queue:", feedback);
    } else {
      messageQueue.current = [];
    }

    if (!shouldConnect) {
      console.warn(
        "Cannot send feedback; WebSocket connection is not established."
      );
      return;
    }

    setIsThinking(true);

    console.log(`WebSocket readyState: ${readyState}`);

    if (readyState === ReadyState.OPEN) {
      console.log(
        "Sending feedback immediately:",
        rating,
        feedback,
        message_id
      );
      sendJsonMessage({
        command: "submit_feedback",
        rating,
        feedback,
        message_id,
      });
      setConversationStarted(true);
      setIsThinking(false);
      messageQueue.current = [];
    }
  };

  const DeleteMessage = (chat_id: string) => {
    // console.log("Deleting message:", chat_id);
    if (!conversationStarted && chat_id.trim() !== "") {
      messageQueue.current.push(chat_id);
      // console.log("Message added to the queue:", chat_id);
    } else {
      messageQueue.current = [];
    }

    if (!shouldConnect) {
      // console.warn(
      //   "Cannot delete message; WebSocket connection is not established."
      // );
      return;
    }

    setIsThinking(true);

    // console.log(`WebSocket readyState: ${readyState}`);

    if (readyState === ReadyState.OPEN) {
      // console.log("Deleting message immediately:", chat_id);
      sendJsonMessage({
        command: "delete_chat",
        chat_id,
      });
      setConversationStarted(true);
      setIsThinking(false);
      messageQueue.current = [];
    }
  };

  return {
    messages,
    sendMessage,
    readyState,
    isThinking,
    DeleteMessage,
    fetchMessages,
    SendFeedback,
  };
};
