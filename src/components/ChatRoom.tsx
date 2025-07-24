import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LogOut, UserCircle2 } from 'lucide-react';

interface ChatRoomProps {
  socket: Socket;
  username: string;
  room: string;
  password?: string;
  isPublic?: boolean;
  initialMessages?: any[];
  initialUsers?: string[];
  onExit: () => void;
}

interface Message {
  text: string;
  username: string;
  timestamp: string;
  type?: 'message' | 'notification';
}

const ChatRoom: React.FC<ChatRoomProps> = ({ socket, username, room, password: initialPassword, isPublic, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [password] = useState<string>(initialPassword || "");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username || !room) return;
    const emitJoin = (pw: string) => {
      if (isPublic || isPublic === undefined) {
        socket.emit('join_room', { username, room });
      } else {
        socket.emit('join_room', { username, room, password: pw });
      }
    };
    if (isPublic || isPublic === undefined) {
      emitJoin("");
    } else {
      let pw = password || (typeof window !== 'undefined' ? localStorage.getItem(`roomPassword:${room}`) : "");
      if (!pw || pw === "") {
        setLoading(true);
        let waited = 0;
        const interval = setInterval(() => {
          pw = typeof window !== 'undefined' ? localStorage.getItem(`roomPassword:${room}`) : "";
          waited += 100;
          if (pw && pw !== "") {
            clearInterval(interval);
            setLoading(false);
            emitJoin(pw);
          } else if (waited >= 1000) {
            clearInterval(interval);
            setLoading(false);
            onExit(); 
          }
        }, 100);
        return;
      }
      emitJoin(pw);
    }
    const handleError = (msg: string) => {
      if (msg.toLowerCase().includes('password')) {
        onExit();
      }
    };
    socket.on('error', handleError);
    return () => {
      socket.off('error', handleError);
      socket.off('connect');
    };
  }, [socket, username, room, password, isPublic, onExit]);

  useEffect(() => {
    socket.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, { ...message, type: 'message' }]);
    });

    socket.on('message_history', (history: Message[]) => {
      setMessages(history.map(m => ({ ...m, type: 'message' })));
    });

    socket.on('notification', (notification: string) => {
      setMessages((prev) => [
        ...prev,
        {
          text: notification,
          username: '',
          timestamp: new Date().toISOString(),
          type: 'notification',
        },
      ]);
    });

    socket.on('update_user_list', (userList: string[]) => {
      setUsers(userList);
    });

    socket.on('typing', (typingUsername: string) => {
      if (typingUsername !== username) {
        setTypingUser(typingUsername);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_history');
      socket.off('notification');
      socket.off('update_user_list');
      socket.off('typing');
    };
  }, [socket, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', newMessage);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
  };

  const handleExit = () => {
    socket.emit('leave_room');
    onExit();
  };

  const sortedUsers = [
    ...users.filter((u) => u === username),
    ...users.filter((u) => u !== username),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">Loading private room...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-0 md:p-4 gap-0 md:gap-4">
      
      <div className="w-full md:w-[300px] flex-shrink-0 bg-white/90 dark:bg-gray-900/80 rounded-b-2xl rounded-2xl shadow-xl mb-5 md:mb-0 border border-gray-200 dark:border-gray-800 overflow-hidden mb-2 md:mb-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600">
          <span className="text-white font-bold text-lg tracking-wide">Users</span>
          <Button size="icon" variant="ghost" className="md:hidden text-white" onClick={handleExit} aria-label="Exit Room">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent dark:scrollbar-thumb-indigo-700 dark:scrollbar-track-transparent rounded-2xl">
          <ul className="space-y-3">
            {sortedUsers.map((user, index) => (
              <li key={index} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${user === username ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                <UserCircle2 className={`h-7 w-7 ${user === username ? 'text-white' : 'text-indigo-400 dark:text-indigo-300'}`} />
                <span className="font-medium text-base truncate">{user}</span>
                {user === username && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">You</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-grow flex flex-col h-full">
        <div className="flex flex-col h-full bg-white/90 dark:bg-gray-900/80 rounded-t-2xl md:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl md:rounded-t-2xl">
            <span className="text-white font-bold text-lg tracking-wide">{room}</span>
            <Button size="sm" variant="destructive" className="hidden md:flex items-center gap-2" onClick={handleExit}>
              <LogOut className="h-4 w-4" />
              Exit Room
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-200px)]  px-2 md:px-6 py-4 md:py-6 bg-transparent chat-scrollbar rounded-2xl">
            <div className="space-y-4">
              {messages.map((msg, index) =>
                msg.type === 'notification' ? (
                  <div
                    key={index}
                    className="flex justify-center"
                  >
                    <div className="bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-gray-700 dark:to-gray-800 text-indigo-700 dark:text-gray-200 px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative p-3 rounded-2xl max-w-[85%] md:max-w-[70%] break-words shadow-lg text-xs md:text-base transition-all ${
                        msg.username === username
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span className="block font-semibold mb-1 text-xs md:text-sm opacity-80">{msg.username}</span>
                      <span className="block mb-1">{msg.text}</span>
                      <span className="block text-[10px] md:text-xs text-right opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              )}
              {typingUser && (
                <div className="flex items-center gap-2 text-xs md:text-sm text-indigo-500 dark:text-indigo-300 font-medium animate-pulse pl-2">
                  <span className="font-semibold">{typingUser}</span> is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-3 md:p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-center rounded-b-2xl">
            <form className="flex gap-2 w-full max-w-2xl" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <Input
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                placeholder="Type a message..."
                className="rounded-full px-5 py-2 shadow text-xs md:text-base border-2 border-indigo-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900 bg-white dark:bg-gray-900 transition-all"
                autoComplete="off"
              />
              <Button type="submit" className="rounded-full px-6 shadow bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-base font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all">Send</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
