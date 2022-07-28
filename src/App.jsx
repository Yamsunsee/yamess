import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Lobby from "./components/Lobby";
import ChatRoom from "./components/ChatRoom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="bg-texture flex min-h-screen w-full select-none items-center justify-center">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="chatroom" element={<ChatRoom />} />
      </Routes>
      <ToastContainer limit={3} />
    </div>
  );
};

export default App;
