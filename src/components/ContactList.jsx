import { useEffect, useState } from "react";
import { db } from "../db/db";
import { useAppContext } from "../context/AppContext";

function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { appState, dispatch } = useAppContext();

  const { data, isLoading, error } = db.useQuery({
    contacts: {},
  });
  useEffect(() => {
    if (appState.contacts.length < 1) {
      dispatch({
        type: "UNSELECT_CONTACT",
      });
    }
  }, [appState.contacts]);

  const handleSearch = () => {
    if (searchQuery.length < 1) return;
    const allUser = data.contacts;
    const selectedContact = allUser.find((user) => user.name === searchQuery);
    if (!selectedContact) {
      console.log("No such User found");
      alert("No User Found!");
      return;
    }
    dispatch({
      type: "SET_CONTACT",
      payload: selectedContact,
    });
    dispatch({
      type: "SELECT_CONTACT",
      payload: selectedContact,
    });
    setSearchQuery("");
  };

  const handleSelectUser = (user) => {
    dispatch({
      type: "SELECT_CONTACT",
      payload: user,
    });
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteButtonClick = (user) => {
    dispatch({
      type: "UNSELECT_CONTACT",
    });
    dispatch({
      type: "REMOVE_CONTACT",
      payload: user,
    });
  };

  return (
    <div className="md:w-1/3 rounded-lg md:h-full  flex flex-col items-center justify-start mx-auto p-5 gap-4 ">
      <h2 className="text-xl font-semibold">Welcome, {appState?.user?.name}</h2>
      <h3 className="text-lg text-red-500 italic font-semibold">
        Search for Contacts
      </h3>

      <div className="flex gap-2 mb-4 ">
        <input
          type="text"
          className="border-none outline-none bg-stone-200 rounded-lg p-2 flex-1"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleEnterKey}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleSearch}
          disabled={isLoading}
        >
          Search
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full h-32 md:h-80 overflow-y-scroll">
        {appState?.contacts?.length > 0 ? (
          appState?.contacts?.map((user) => {
            return (
              <span
                key={user.id}
                className={`p-3  flex items-center justify-between rounded-lg mb-2 cursor-pointer font-semibold bg-stone-200 hover:bg-stone-300`}
              >
                <span className="flex-1" onClick={() => handleSelectUser(user)}>
                  {user.name}
                </span>

                <button
                  className="cursor-pointer bg-stone-500  rounded-md px-2 hover:bg-red-500 text-white"
                  onClick={() => handleDeleteButtonClick(user)}
                >
                  X
                </button>
              </span>
            );
          })
        ) : (
          <p className="text-red-500">No contacts found</p>
        )}
      </div>
    </div>
  );
}

export default ContactList;
