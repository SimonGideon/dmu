import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  myChatFeedback: (
    rating: number,
    feedback: string,
    message_id: number
  ) => void;
  messageId: number;
};

export default function Feedback({ myChatFeedback, messageId }: Props) {
  return (
    <div className="flex justify-end items-center mt-2">
      <button
        className="flex items-center justify-center w-8 h-8 bg-green-200 dark:bg-green-700 rounded-full"
        onClick={() => myChatFeedback(1, "Good response.", messageId)}
      >
        <FontAwesomeIcon
          icon={faThumbsUp}
          className="text-green-500 dark:text-green-300"
        />
      </button>
      <button
        className="flex items-center justify-center w-8 h-8 bg-red-200 dark:bg-red-700 rounded-full ml-2"
        onClick={() => myChatFeedback(0, "Bad response.", messageId)}
      >
        <FontAwesomeIcon
          icon={faThumbsDown}
          className="text-red-500 dark:text-red-300"
        />
      </button>
    </div>
  );
}
