import { Header, MainContent, History } from "./../components";
import { isAuthenticated } from "./../utils/authUtils";

const HomePage: React.FC = () => {
  return (
    <div className="bg-background dark:bg-darkBackground text-text dark:text-darkText flex w-full h-screen overflow-hidden">
      {isAuthenticated() && (
        <div className="md:w-1/4 sticky top-0 h-screen">
          <History />
        </div>
      )}

      <div className="flex flex-col justify-between w-full max-h-screen overflow-y-auto">
        <Header />
        <MainContent />
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default HomePage;
