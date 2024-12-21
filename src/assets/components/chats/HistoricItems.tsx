import { ChatHistoryItem } from "../../components";
import { useDispatch } from "react-redux";
import { deleteChatMessage } from "../../redux/chats/chatSlice";
import { AppDispatch } from "../../redux/store";

interface Chat {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  chat_id: string;
  author: number;
}

interface GroupedChats {
  today: Chat[];
  yesterday: Chat[];
  last7Days: Chat[];
  last30Days: Chat[];
  older: Chat[];
}

interface HistoricItemProps {
  groupedChats: GroupedChats;
}

const HistoricItem: React.FC<HistoricItemProps> = ({ groupedChats }) => {
  const dispatch = useDispatch<AppDispatch>();

  // for (let i = 0; i < groupedChats.today.length; i++) {
  //   // Send delete request for each chat in 'today'
  //   dispatch(deleteChatMessage(groupedChats.last7Days[i].chat_id));
  // }

  const onDelete = (chat: Chat) => {
    dispatch(deleteChatMessage(chat.chat_id));
  };

  const renderSection = (title: string, chats: Chat[]) => {
    if (chats.length > 0) {
      return (
        <section className="mb-6">
          <p className="text-sm font-bold mb-4 sticky top-0 bg-slate-100 dark:bg-darkBackground200 z-10">
            {title}
          </p>
          {chats.map((chat) => (
            <ChatHistoryItem key={chat.id} chat={chat} onDelete={onDelete} />
          ))}
        </section>
      );
    }
    return null;
  };

  return (
    <div className="px-5 max-h-[85vh] overflow-y-auto">
      {renderSection("Today", groupedChats.today)}
      {renderSection("Yesterday", groupedChats.yesterday)}
      {renderSection("Last 7 Days", groupedChats.last7Days)}
      {renderSection("Last 30 Days", groupedChats.last30Days)}
      {renderSection("Older", groupedChats.older)}
    </div>
  );
};

export default HistoricItem;
