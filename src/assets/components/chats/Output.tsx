import React from "react";
import ChatHeader from "./ChatHeader";
import { isAuthenticated } from "../../utils/authUtils";
import ExistingChats from "./ExistingChats";
import ChatAttachment from "./Attachments";
import MarkdownRenderer from "./Markdown";
import { ChatMessage } from "../../redux/chats/types";
import { Feedback } from "./../index";

interface ChatOutputProps {
  chatResponse: ChatMessage[];
  thinking: boolean;
  myChatFeedback: (
    rating: number,
    feedback: string,
    message_id: number
  ) => void;
}

const ChatOutput: React.FC<ChatOutputProps> = ({
  chatResponse,
  myChatFeedback,
}) => {
  if (!isAuthenticated() && chatResponse.length === 0) {
    return <ChatHeader />;
  }

  console.log("Chat Response: ", chatResponse);
  return (
    <div className="flex flex-col items-center w-full md:w-[49vw] mx-auto">
      <div className="flex flex-col w-full space-y-4 px-4 overflow-y-auto max-h-[85vh] text-text dark:text-slate-200 hide-scrollbar">
        {chatResponse && chatResponse[0]?.messages ? (
          <ExistingChats
            chatMessages={
              Array.isArray(chatResponse[0].messages)
                ? chatResponse[0].messages
                : []
            }
            myChatFeedback={myChatFeedback}
          />
        ) : null}
        {chatResponse.map((chat, index) => {
          const isUserMessage = chat.command === "new_message";

          const messageText = chat.message?.message || "";
          const responseText = chat.message?.response || "";
          const attachments = chat.message?.attachments || [];
          const messageId = chat.message?.id || 0;
          console.log("Chat: ", chat);
          console.log("Message: ", messageText);
          console.log("Response: ", responseText);
          console.log("Attachments: ", attachments);
          return (
            <div
              key={index}
              className={`flex ${
                isUserMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-full p-1 rounded-lg ${
                  isUserMessage
                    ? "sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] bg-gray-100 dark:bg-gray-700 rounded-br-none"
                    : "max-w-[85%] bg-gray-200 dark:bg-gray-800 rounded-bl-none"
                }`}
              >
                {isUserMessage ? (
                  <>
                    <MarkdownRenderer content={messageText} />
                    {attachments.length > 0 && (
                      <ChatAttachment attachments={attachments} />
                    )}
                  </>
                ) : (
                  <>
                    {chat.message?.response &&
                      chat.message?.response !== "" && (
                        <>
                          <MarkdownRenderer content={responseText} />
                          {attachments.length > 0 &&
                            attachments.some(
                              (attachment: { category: string }) =>
                                attachment.category === "RESPONSE"
                            ) && <ChatAttachment attachments={attachments} />}

                          <Feedback
                            myChatFeedback={myChatFeedback}
                            messageId={messageId}
                          />
                        </>
                      )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatOutput;
