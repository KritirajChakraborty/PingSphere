import { useEffect, useState } from "react";
import { db, getAllMessages } from "../db/db";
import { id } from "@instantdb/react";
import MessageInput from "./MessageInput";
import { useAppContext } from "../context/AppContext";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [openEmojiPicker, setEmojiPicker] = useState(false);
  const { appState, dispatch } = useAppContext();
  const AllMessages = getAllMessages();
  const user = appState?.user?.name;
  const endUser = appState.selectedContact?.name;

  useEffect(() => {
    dispatch({
      type: "SET_MESSAGE",
      payload: AllMessages,
    });
  }, [appState.messages]);

  const query = {
    messages: {
      $: {
        where: {
          and: [
            { or: [{ sender: endUser }, { sender: user }] },
            { or: [{ reciever: endUser }, { reciever: user }] },
          ],
        },
      },
    },
  };
  const { data, isLoading, error } = db.useQuery(query);

  const handleSignOut = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  if (!appState.selectedContact) {
    return (
      <div className="flex-[2_2_0%] bg-stone-200 rounded-lg w-full h-full  flex flex-col items-center justify-center p-5 gap-10">
        <p className="text-lg font-medium break-words">
          Select a contact to start a conversation!
        </p>
        <button
          className="ml-2 bg-red-500 text-white text-sm p-3 rounded-lg shadow hover:bg-red-600"
          onClick={handleSignOut}
        >
          Signout
        </button>
      </div>
    );
  }
  if (error) {
    console.log(error);
    return (
      <p className="p-4 flex items-center justify-center">
        Oops, something broke on Instant's end. Please refresh the page or
        delete the selected contact
      </p>
    );
  }

  const handleEmojiClick = (e) => {
    setInput((prev) => (prev += e.emoji));
    setEmojiPicker(false);
  };

  const handleTextChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.length < 1) return;
    const timestamp = new Date().getTime();
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        text: input,
        sender: user,
        reciever: endUser,
        createdAt: timestamp,
      },
    });
    db.transact([
      db.tx.messages[id()].update({
        text: input,
        sender: user,
        reciever: endUser,
        createdAt: timestamp,
      }),
    ]);
    setInput("");
  };

  return (
    <div className="w-full md:flex-1  md:h-full bg-stone-200 rounded-lg flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between border-b border-gray-300 pb-3">
        <h3 className="text-3xl font-semibold tracking-tighter text-stone-700 ">
          {appState?.selectedContact?.name}
        </h3>
        <button
          className="ml-2 bg-red-500 text-white text-sm p-3 rounded-lg shadow hover:bg-red-600"
          onClick={handleSignOut}
        >
          Signout
        </button>
      </div>
      {isLoading ? (
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      ) : data?.messages?.length ? (
        <ul className="flex flex-col justify-start p-3 gap-4 overflow-y-scroll w-full h-72 md:h-full">
          {data?.messages?.map((message) => (
            <li
              key={message.id}
              className={`flex ${
                message.sender === user ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`flex flex-col max-w-[70%] items-start gap-1 p-3 rounded-lg shadow-md ${
                  message.sender === user
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                <p
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                  className="text-lg font-medium"
                >
                  {message.text}
                </p>
                <span className="text-xs italic">{`^ ${message.sender}`}</span>
              </div>
              {message.sender === user && (
                <button
                  className="ml-2 bg-red-500 text-white text-xs w-10 h-10 rounded-lg shadow hover:bg-red-600"
                  onClick={(e) => {
                    db.transact([db.tx.messages[message.id].delete()]);
                    dispatch({
                      type: "DELETE_MESSAGE",
                      payload: message.createdAt,
                    });
                  }}
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-700">No messages!</p>
      )}
      <MessageInput
        text={input}
        onTextChange={handleTextChange}
        onEmojiClick={handleEmojiClick}
        onClick={handleSubmit}
        openEmojiPicker={openEmojiPicker}
        setEmojiPicker={setEmojiPicker}
      />
    </div>
  );
};

export default ChatWindow;
