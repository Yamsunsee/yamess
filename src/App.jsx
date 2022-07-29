import { Routes, Route } from "react-router-dom";
import Signup from "./routes/Signup";
import Signin from "./routes/Signin";
import Lobby from "./routes/Lobby";
import ChatRoom from "./routes/ChatRoom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

