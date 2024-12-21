export interface PromptLibraryResult {
  id: number;
  category: string | null;
  created_at: string;
  updated_at: string;
  deleted_flag: string;
  title: string;
  description: string;
  onliner: string;
  prompt: string;
  tenant: number;
}

export interface Chat {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  chat_id: string;
  author: number;
}

export interface PromptLibraryData {
  count: number;
  next: string | null;
  previous: string | null;
  results: PromptLibraryResult[];
}

export interface Attachment {
  id: number;
  url: string;
  type: string;
  category: string;
  message_type: string;
  metadata: {
    mime_type: string;
    original_name: string;
  };
}

export interface ChatMessage {
  id: number;
  chat_id: string;
  sender_email: string | null;
  sender_id: string | null;
  message: {
    chat_id: string;
    id: number;
    sender_email: string | null;
    sender_id: string | null;
    message: string | null;
    response: string | null;
    timestamp: string;
    updated_at: string;
    attachments?: [];
  } | null;
  messages: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    chat_id: string;
    id: number;
    sender_email: string | null;
    sender_id: string | null;
    message: string | null;
    response: string | null;
    timestamp: string;
    updated_at: string;
  } | null;
  command: string;
  response_message: string;
  response_status: string;
  response: string | null;
  timestamp: string;
  updated_at: string;
  attachments?: Attachment[];
  message_type?: string;
  type?: string;
}

export interface chatFeedback {
  rating: number;
  feedback: string;
  message_id: number;
}
