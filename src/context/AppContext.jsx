import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext(null);

const initialState = {
  user: null,
  contacts: [],
  messages: [],
  selectedContact: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload };

    case "LOGOUT":
      localStorage.removeItem("authUser");
      return { user: null };

    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SELECT_CONTACT":
      return { ...state, selectedContact: action.payload };
    case "UNSELECT_CONTACT":
      return { ...state, selectedContact: null };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
