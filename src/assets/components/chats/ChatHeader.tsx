import { useCustomTheme } from "../../hooks/ThemeContext";

const ChatHeader: React.FC = () => {
  const { tenantTheme } = useCustomTheme();
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          {tenantTheme?.background_image && (
            <img src={tenantTheme.background_image} alt=" Logo" className="w-24" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-6 text-text dark:text-darkText animate-typing">
          What can I help with?
        </h1>
      </div>
    </div>
  );
};

export default ChatHeader;
