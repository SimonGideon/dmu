import React from "react";
import ChatAttachment from "./Attachments";
import MarkdownRenderer from "./Markdown";
import { Attachment } from "../../redux/chats/types";
import { Feedback } from "./../index";

interface ChatMessage {
  id: number;
  chatId: string;
  senderEmail: string | null;
  senderId: string | null;
  message: string | null;
  response: string | null;
  attachments?: Attachment[];
  timestamp: string;
  updatedAt: string;
}

interface ExistingChatsProps {
  chatMessages: ChatMessage[];
  myChatFeedback: (rating: number, feedback: string, messageId: number) => void;
}

const ExistingChats: React.FC<ExistingChatsProps> = ({
  chatMessages,
  myChatFeedback,
}) => {
  return (
    <div className="flex flex-col items-center w-full mx-auto">
      <div className="flex flex-col w-full space-y-4 px-4 overflow-y-auto text-text dark:text-slate-200 scrollbar-none">
        {chatMessages.map((chat, index) => {
          const promptAttachments = chat.attachments?.filter(
            (attachment) => attachment.category === "PROMPT"
          );
          const responseAttachments = chat.attachments?.filter(
            (attachment) => attachment.category === "RESPONSE"
          );
          console.log("promptAttachments: ", promptAttachments);
          console.log("responseAttachments: ", responseAttachments);
          return (
            <div key={index} className="flex flex-col">
              {(chat.message || (promptAttachments?.length ?? 0) > 0) && (
                <div className="flex justify-end">
                  <div className="max-w-full rounded-lg sm:max-w-[60%] md:max-w-[50%] lg:max-w-[45%] bg-gray-100 dark:bg-gray-800 rounded-br-none mb-4">
                    {chat.message && (
                      <MarkdownRenderer content={chat.message} />
                    )}
                    {(promptAttachments?.length ?? 0) > 0 && (
                      <ChatAttachment attachments={promptAttachments ?? []} />
                    )}
                  </div>
                </div>
              )}

              {(chat.response || (responseAttachments?.length ?? 0) > 0) && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] p-1 rounded-lg bg-gray-200 dark:bg-gray-800 rounded-bl-none">
                    {chat.response && (
                      <MarkdownRenderer content={chat.response} />
                    )}
                    {responseAttachments && responseAttachments.length > 0 && (
                      <ChatAttachment attachments={responseAttachments} />
                    )}
                    <Feedback
                      myChatFeedback={myChatFeedback}
                      messageId={chat.id}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExistingChats;
