import ChatWindow from "./components/ChatWindow";
import ContactList from "./components/ContactList";
import Login from "./components/Login";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { appState } = useAppContext();

  return (
    <div className="flex flex-col md:flex-row items-start justify-center h-screen  w-full p-4 md:p-6 gap-15 md:gap-6">
      {appState.user ? (
        <>
          <ContactList />
          <ChatWindow />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
