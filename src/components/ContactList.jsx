import { useEffect, useState } from "react";
import { db } from "../db";
import { useAppContext } from "../context/AppContext";

function ContactList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { appState, dispatch } = useAppContext();

  const { data, isLoading, error } = db.useQuery({
    contacts: {},
  });
  useEffect(() => {
    if (searchResults.length < 1) {
      dispatch({
        type: "UNSELECT_CONTACT",
      });
    }
  }, [searchResults]);

  const handleSearch = () => {
    if (searchQuery.length < 1) return;
    const allUser = data.contacts;
    const selectedContact = allUser.find((user) => user.name === searchQuery);
    if (!selectedContact) {
      console.log("No such User found");
      alert("No User Found!");
      return;
    }
    setSearchResults((prev) => [...prev, selectedContact]);
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

  return (
    <div className="w-full md:w-1/3 h-[calc(100vh-2rem)] flex flex-col bg-white rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Search for Contacts</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border-none outline-none bg-stone-200 rounded-lg p-2 flex-1"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((user) => {
            return (
              <span
                key={user.id}
                className={`p-3  flex items-center justify-between rounded-lg mb-2 cursor-pointer font-semibold bg-stone-200 hover:bg-stone-300`}
                onClick={() => handleSelectUser(user)}
              >
                {user.name}{" "}
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    setSearchResults((prev) =>
                      prev.filter((prevUser) => prevUser.name != user.name)
                    )
                  }
                >
                  X
                </button>
              </span>
            );
          })
        ) : (
          <p>No contacts found</p>
        )}
      </div>
    </div>
  );
}

export default ContactList;
