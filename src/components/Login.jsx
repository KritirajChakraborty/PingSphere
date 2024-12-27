import { useState } from "react";
import { db } from "../db";
import { id } from "@instantdb/react";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [loginState, setIsLoginState] = useState(false);
  const { appState, dispatch } = useAppContext();
  const { data, isLoading, error } = db.useQuery({
    contacts: {},
  });

  const handleSubmit = () => {
    if (userName.length < 1) return;
    const allUsers = data.contacts;
    const selectedUser = allUsers.find((user) => user.name == userName);
    if (selectedUser) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: selectedUser,
      });
      setUserName("");
    } else {
      db.transact(db.tx.contacts[id()].update({ name: userName }));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: userName,
      });

      setUserName("");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full bg-stone-200 rounded-lg">
      {/* signup */}
      <form className="flex flex-col items-center justify-center w-full max-w-2xl border border-gray-300 rounded-lg p-3 gap-5">
        <h2 className="text-3xl font-bold text-stone-800 text-center">
          {loginState ? "Sign In" : "Sign Up"}
        </h2>

        <input
          className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500"
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <button
          className="w-full p-3 bg-stone-800 text-white rounded-lg font-semibold hover:bg-stone-900 transition-colors"
          type="button"
          onClick={handleSubmit}
        >
          {loginState ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-center text-stone-600">
          {loginState ? "New user? " : "Already have an account? "}
          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setIsLoginState(!loginState)}
            type="button"
          >
            {loginState ? "Create account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
