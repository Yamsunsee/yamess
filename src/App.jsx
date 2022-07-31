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
        <Route path="yamess" element={<Lobby />} />
        <Route path="yamess/signup" element={<Signup />} />
        <Route path="yamess/signin" element={<Signin />} />
        <Route path="yamess/chatroom" element={<ChatRoom />} />
      </Routes>
      <ToastContainer limit={3} />
    </div>
  );
};

export default App;

