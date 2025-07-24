import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import AppShell from "./components/ui/AppShell";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";
import Footer from "./components/ui/Footer";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Restore state from localStorage
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "home");
  const [roomName, setRoomName] = useState(() => localStorage.getItem("roomName") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [roomPassword, setRoomPassword] = useState<string>(() => {
    const room = localStorage.getItem("roomName");
    return room ? localStorage.getItem(`roomPassword:${room}`) || "" : "";
  });
  const [isPublic, setIsPublic] = useState<boolean>(() => {
    // Try to restore isPublic from localStorage, fallback to true
    const val = localStorage.getItem("isPublic");
    return val === null ? true : val === "true";
  });
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [initialUsers, setInitialUsers] = useState<string[]>([]);
  const lastCreatedRoomRef = useRef<string | null>(null);

  // On mount, if mode is "chat" but required info is missing, go to home
  useEffect(() => {
    if (
      mode === "chat" &&
      (
        !roomName ||
        !username ||
        (isPublic === false && !roomPassword)
      )
    ) {
      setMode("home");
      localStorage.setItem("mode", "home");
    }
  }, [mode, roomName, username, isPublic, roomPassword]);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem("mode", mode);
    localStorage.setItem("roomName", roomName);
    localStorage.setItem("username", username);
    localStorage.setItem("isPublic", isPublic ? "true" : "false");
    if (roomPassword && roomName) {
      localStorage.setItem(`roomPassword:${roomName}`, roomPassword);
    }
  }, [mode, roomName, username, roomPassword, isPublic]);

  // Socket.io connection (adjust the URL/port as needed)
  const socketRef = useRef<Socket | null>(null);
  if (!socketRef.current) {
    socketRef.current = io("http://localhost:3000"); // Change port if your server uses a different one
  }
  const socket = socketRef.current;

  // Determine dark mode for toastify
  const isDark = typeof window !== 'undefined' ? (localStorage.getItem("darkMode") === "true") : false;

  return (
    <>
      <AppShell>
        {mode === "home" && <Home setMode={setMode} />}
        {mode === "create" && (
          <CreateRoom
            socket={socket}
            onRoomCreated={(room) => {
              setMode("home");
              setIsPublic(room.isPublic !== false);
              if (lastCreatedRoomRef.current !== room.name) {
                toast.success(`Room "${room.name}" created successfully!`, {
                  theme: isDark ? "dark" : "light",
                  position: "top-right",
                  autoClose: 3000,
                });
                lastCreatedRoomRef.current = room.name;
              }
            }}
            onBack={() => setMode("home")}
          />
        )}
        {mode === "join" && (
          <JoinRoom
            socket={socket}
            onJoin={(usernameInput, room, password, isPublicRoom, messages, users) => {
              setUsername(usernameInput);
              setRoomName(room);
              setRoomPassword(password || "");
              setIsPublic(isPublicRoom !== false);
              setInitialMessages(messages || []);
              setInitialUsers(users || []);
              setMode("chat"); // <--- Ensure mode is set to "chat" on join
              if (password) {
                localStorage.setItem(`roomPassword:${room}`, password);
              }
            }}
            onBack={() => setMode("home")}
          />
        )}
        {mode === "chat" && (
          <ChatRoom
            socket={socket}
            username={username}
            room={roomName}
            password={roomPassword}
            isPublic={isPublic}
            onExit={() => {
              setMode("home");
              setRoomName("");
              setRoomPassword("");
              setIsPublic(true);
              localStorage.setItem("mode", "home");
              localStorage.removeItem("roomName");
              localStorage.removeItem("username");
              localStorage.removeItem("isPublic");
              // Optionally: localStorage.removeItem(`roomPassword:${roomName}`);
            }}
            initialMessages={initialMessages}
            initialUsers={initialUsers}
          />
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
      </AppShell>
      <Footer />
    </>
  );
}

export default App;

