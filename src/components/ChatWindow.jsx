import { useState } from "react";
import { db } from "../db";
import { id } from "@instantdb/react";
import MessageInput from "./MessageInput";
import { useAppContext } from "../context/AppContext";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [openEmojiPicker, setEmojiPicker] = useState(false);
  const { appState, dispatch } = useAppContext();

  const user = appState?.user?.name;
  const endUser = appState.selectedContact?.name;
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
  if (error)
    return <p className="p-4 flex items-center">Oops, something broke</p>;

  const handleEmojiClick = (e) => {
    console.log(e.emoji);
    setInput((prev) => (prev += e.emoji));
    setEmojiPicker(false);
  };

  const handleTextChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.length < 1) return;
    const timestamp = new Date().getTime();
    console.log(timestamp);
    console.log(input);
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

  console.log(data);

  return (
    <div className="w-full md:flex-1 h-[calc(100vh-2rem)] bg-stone-200 rounded-lg flex flex-col p-4 gap-4">
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
        <p className="italic flex items-center text-gray-700">Loading...</p>
      ) : data?.messages.length ? (
        <ul className="flex flex-col justify-start p-3 gap-4 overflow-y-auto w-full h-full">
          {data.messages.map((message) => (
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
                <p className="text-lg font-medium break-words">
                  {message.text}
                </p>
                <span className="text-xs italic">{`^ ${message.sender}`}</span>
              </div>
              {message.sender === user && (
                <button
                  className="ml-2 bg-red-500 text-white text-xs w-10 h-10 rounded-lg shadow hover:bg-red-600"
                  onClick={(e) => {
                    db.transact([db.tx.messages[message.id].delete()]);
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
