import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromptLibraryData } from '../../redux/chats/propmtLibrary';
import { RootState, AppDispatch } from '../../redux/store';
import { PromptLibraryResult } from '../../redux/chats/types';

interface PromptLibrariesProps {
  onPromptClick: (prompt: string) => void;
}

const PromptLibraries: React.FC<PromptLibrariesProps> = ({ onPromptClick }) => {
  const dispatch: AppDispatch = useDispatch();
  const { res: promptLibraryData, loading, error } = useSelector((state: RootState) => state.promptLibrary);

  useEffect(() => {
    dispatch(fetchPromptLibraryData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const hasPromptData =
    promptLibraryData &&
    promptLibraryData.results &&
    promptLibraryData.results.length > 0;

  return (
    <div className="container mx-auto p-4">
      {hasPromptData ? (
        <ul className="space-y-4">
          {promptLibraryData.results.map((promptItem: PromptLibraryResult) => (
            <button
              key={promptItem.id}
              onClick={() => onPromptClick(promptItem.prompt)}
              className="flex items-center space-x-2 text-slate-500 dark:text-darkText px-4 py-2 rounded-full border-[1px] border-slate-300 dark:border-darkText hover:bg-slate-500 dark:hover:bg-slate-800 hover:bg-opacity-10 transition duration-200"
            >
              <span>{promptItem.prompt}</span>
            </button>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PromptLibraries;
