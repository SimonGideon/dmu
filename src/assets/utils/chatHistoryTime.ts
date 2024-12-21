interface Chat {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  chat_id: string;
  author: number;
}

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const isWithinLastNDays = (date: Date, days: number): boolean => {
  const today = new Date();
  const difference = today.getTime() - date.getTime();
  return difference <= days * 24 * 60 * 60 * 1000;
};

export const groupChatsByDate = (chatData: Chat[]) => {
  const groupedChats = {
    today: [] as Chat[],
    yesterday: [] as Chat[],
    last7Days: [] as Chat[],
    last30Days: [] as Chat[],
    older: [] as Chat[],
  };

  chatData.forEach((chat) => {
    const createdOnDate = new Date(chat. updated_at);
    const chatMessage = chat.title || 'No title';

    const formattedChat: Chat = {
      id: chat.id,
      created_at: chat.created_at,
      updated_at: chat.updated_at,
      title: chatMessage,
      chat_id: chat.chat_id,
      author: chat.author,
    };

    if (isToday(createdOnDate)) {
      groupedChats.today.push(formattedChat);
    } else if (isYesterday(createdOnDate)) {
      groupedChats.yesterday.push(formattedChat);
    } else if (isWithinLastNDays(createdOnDate, 7)) {
      groupedChats.last7Days.push(formattedChat);
    } else if (isWithinLastNDays(createdOnDate, 30)) {
      groupedChats.last30Days.push(formattedChat);
    } else {
      groupedChats.older.push(formattedChat);
    }
  });

  return groupedChats;
};
