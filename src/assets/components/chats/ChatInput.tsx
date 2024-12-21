import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faImage,
  faMicrophone,
  faStop,
  faPlay,
  faPause,
  faTimes,
  faTrashAlt,
  faPaperPlane,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

interface ChatInputProps {
  sendMessageToChat: (
    message: string,
    files: Array<{ name: string; type: string; content: string }>,
    mode: string
  ) => void;
}

const ChatInput = ({ sendMessageToChat }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mode, setMode] = useState("TEXT");
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [toggleInput, setToggleInput] = useState(false);
  const [files, setFiles] = useState<
    Array<{ name: string; type: string; content: string }>
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleRemoveImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
    setInputValue("");
    setFiles([]);
    setImagePreviews([]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      if (audioPreview) {
        setAudioPreview(null);
        setIsPlaying(false);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioPreview(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      // console.error("Error accessing microphone:", err);
      return err;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioPreview && !isPlaying) {
      const audio = new Audio(audioPreview);
      audioPlayerRef.current = audio;
      audio.onended = () => setIsPlaying(false);

      audio.play();
      setIsPlaying(true);
    } else if (audioPlayerRef.current && isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSendAudio = () => {
    if (audioPreview) {
      const audioMessage = {
        name: "audio-message.wav",
        type: "audio/wav",
        content: audioPreview.split(",")[1],
      };

      // console.log("This is the audiio" + audioPreview.split(",")[1]);

      setFiles([audioMessage]);
      sendMessageToChat("", [audioMessage], mode);
      setAudioPreview(null);
      setIsPlaying(false);
      setImagePreviews([]);
      setToggleInput(false);
    } else if (inputValue.trim() || files.length > 0) {
      sendMessageToChat(inputValue, files, mode);
      setInputValue("");
      setFiles([]);
      setImagePreviews([]);
      setToggleInput(false);
    }
  };

  const handleRemoveAudioPreview = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioPreview(null);
    setIsPlaying(false);
    setToggleInput(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      const filePromises = selectedFiles.map((file) => {
        return new Promise<{ name: string; type: string; content: string }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              const base64Content = dataUrl.split(",")[1];
              resolve({
                name: file.name,
                type: file.type,
                content: base64Content,
              });
            };
            reader.readAsDataURL(file);
          }
        );
      });

      Promise.all(filePromises).then((newFiles) => {
        setFiles((prev) => [...prev, ...newFiles]);

        const previews = selectedFiles.map((file) => {
          const reader = new FileReader();
          return new Promise<string>((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(previews).then((urls) => {
          setImagePreviews((prev) => [...prev, ...urls]);
        });
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[100vw] md:max-w-[47vw] mb-8 flex flex-col items-center bg-slate-200 dark:bg-darkBackground200 rounded-[20px] p-4 space-y-4 min-h-20">
      <div className="mb-4 content-start w-full min-h-12">
        {(imagePreviews.length === 0 || audioPreview !== null) && (
          <select
            value={mode}
            onChange={handleModeChange}
            className="bg-slate-200 dark:bg-darkBackground200 border border-transparent dark:border-gray-800 px-4 py-2 rounded-md h-12 focus:outline-none"
          >
            <option value="TEXT">Text</option>
            <option value="IMAGE">Image</option>
          </select>
        )}
      </div>
      <div className="w-full relative flex items-center">
        {mode === "TEXT" && (
          <>
            <button
              onClick={toggleDropdown}
              className="absolute left-2 flex items-center justify-center h-full w-10 text-text dark:text-darkText focus:outline-none"
            >
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
            <div className="absolute bottom-10 -left-4 flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              {files.map((file, index) => {
                if (file.type.startsWith("image/")) {
                  return (
                    <div key={index} className="relative w-16 h-16 group">
                      <img
                        src={`data:${file.type};base64,${file.content}`}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-0 right-0 text-red-600 bg-slate-300 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImagePreview(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  );
                } else if (file.type === "application/pdf") {
                  return (
                    <div key={index} className="relative w-16 h-16 group">
                      <embed
                        src={`data:application/pdf;base64,${file.content}`}
                        type="application/pdf"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-0 right-0 text-red-600 bg-slate-300 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImagePreview(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-14 w-40 bg-white dark:bg-darkBackground200 rounded-md shadow-lg z-10 border dark:border-gray-600"
              >
                <label
                  htmlFor="file-upload-images"
                  className="block w-full text-left px-4 py-2 text-sm text-slate-500 dark:text-darkText hover:bg-slate-500 dark:hover:bg-slate-900 hover:bg-opacity-10 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faImage} className="text-green-700" />{" "}
                  Images
                </label>
                <input
                  id="file-upload-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="file-upload-docs"
                  className="block w-full text-left px-4 py-2 text-sm text-slate-500 dark:text-darkText hover:bg-slate-500 dark:hover:bg-slate-900 hover:bg-opacity-10 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-purple-700"
                  />{" "}
                  Documents
                </label>
                <input
                  id="file-upload-docs"
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {imagePreviews.length === 0 && (
              <button
                onClick={() => {
                  setToggleInput(true);
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                className="absolute left-12 flex items-center justify-center h-full w-10 text-text dark:text-darkText focus:outline-none"
              >
                <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
              </button>
            )}
          </>
        )}

        <input
          type="text"
          placeholder={
            isRecording ? "Recording audio..." : "Type your message..."
          }
          value={inputValue}
          onChange={handleInputChange}
          disabled={toggleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              sendMessageToChat(inputValue, files, mode);
              setInputValue("");
            }
          }}
          className={`w-full ${
            mode === "IMAGE" ? "pl-2" : "pl-20"
          } pr-12 bg-transparent text-text dark:text-darkText focus:ring-0 focus:outline-none`}
        />

        {audioPreview && (
          <div className="absolute left-20 flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
            <button
              className="mr-2 text-text dark:text-darkText"
              onClick={handlePlayAudio}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>

            <span className="truncate text-sm mr-2">Audio ready to send</span>

            <button
              className="text-text dark:text-darkText"
              onClick={handleRemoveAudioPreview}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2.5 py-1 rounded-full dark:text-white text-darkBackground200 text-lg"
          onClick={() => {
            if (audioPreview) {
              handleSendAudio();
            } else if (inputValue.trim() || files.length > 0) {
              sendMessageToChat(inputValue, files, mode);
              setInputValue("");
              setFiles([]);
            }
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
