import React from "react";
import { hostDomain } from "../../redux/api/api";
import { Attachment } from "../../redux/chats/types";
import { pdfIcon } from "../../images";

interface ChatAttachmentProps {
  attachments: Attachment[];
}

const ChatAttachment: React.FC<ChatAttachmentProps> = ({ attachments }) => {
  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        if (attachment.type === "IMAGE") {
          return (
            <div className="masonry">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="masonry-item">
                  <img
                    src={hostDomain + attachment.url}
                    alt={attachment.metadata.original_name}
                    className="max-w-full rounded-md"
                  />
                </div>
              ))}
            </div>
          );
        } else if (attachment.type === "AUDIO") {
          return (
            <audio key={attachment.id} controls className="w-full md:w-80">
              <source
                src={hostDomain + attachment.url}
                type={attachment.metadata.mime_type}
              />
              Your browser does not support the audio element.
            </audio>
          );
        } else if (attachment.type === "DOCUMENT") {
          return (
            <div className="flex items-center space-x-2">
              <img src={pdfIcon} alt="pdf" className="w-8 h-8" />
              <a
                key={attachment.id}
                href={hostDomain + attachment.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 truncate max-w-xs"
              >
                {attachment.metadata.original_name}
              </a>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ChatAttachment;
