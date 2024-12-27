import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const MessageInput = ({
  text,
  onTextChange = () => {},
  onEmojiClick = () => {},
  onClick = () => {},
  openEmojiPicker,
  setEmojiPicker,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 relative border-t border-gray-300 w-full mt-auto pt-3">
      <div className="relative">
        <FaSmile
          className="text-2xl text-stone-700 cursor-pointer"
          onClick={() => setEmojiPicker((prev) => !prev)}
        />
        {openEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              className="border border-gray-300 rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
      <input
        className="p-3 w-full rounded-lg outline-none border text-stone-700  border-gray-300"
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={onTextChange}
      />

      <button
        className="bg-stone-700 hover:bg-stone-600 text-stone-100 text-sm p-3 rounded-md"
        onClick={onClick}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
