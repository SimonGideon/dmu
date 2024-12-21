import { Header, MainContent, History } from "./../components";
import { isAuthenticated } from "./../utils/authUtils";
import { useParams } from "react-router-dom";

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground text-text dark:text-darkText flex w-full justify-between">
      {isAuthenticated() && (
        <div className="md:w-1/4">
          <History />
        </div>
      )}

      <div className="flex flex-col justify-between w-full">
        <Header />
        <MainContent authChatId={id} />
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default ChatPage;
