import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Socket } from 'socket.io-client';
import { useState, useEffect } from "react";
import { LogIn, Lock, ArrowLeft, Globe } from 'lucide-react';

interface JoinRoomProps {
  socket: Socket;
  onJoin: (username: string, room: string, password?: string, isPublic?: boolean, messages?: any[], users?: string[]) => void;
  onBack: () => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ socket, onJoin, onBack }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [password, setPassword] = useState('');
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [joinType, setJoinType] = useState<'public' | 'private'>('public');
  const [errors, setErrors] = useState<{ username?: string; room?: string; password?: string }>({});
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    socket.emit('get_public_rooms');
    socket.on('public_rooms', (rooms) => {
      setPublicRooms(rooms);
    });
    socket.off('error');
    socket.off('message_history');
    socket.on('error', (msg) => {
      if (msg.toLowerCase().includes('password')) {
        setErrors((prev) => ({ ...prev, password: msg }));
      } else if (msg.toLowerCase().includes('name')) {
        setErrors((prev) => ({ ...prev, room: msg }));
      } else {
        setErrors((prev) => ({ ...prev, room: msg }));
      }
      setJoining(false); 
    });
    socket.on('message_history', (messages) => {
      if (joining && username && room) {
        let users: string[] = [];
        const handleUserList = (userList: string[]) => {
          users = userList;
        };
        socket.once('update_user_list', handleUserList);
        setTimeout(() => {
          onJoin(
            username,
            room,
            joinType === 'public' ? undefined : password,
            joinType === 'public',
            messages,
            users
          );
          setJoining(false);
        }, 100); 
      }
    });
    return () => {
      socket.off('public_rooms');
      socket.off('error');
      socket.off('message_history');
    };
  }, [socket, username, room, password, joining, onJoin, joinType]);

  const handleJoin = () => {
    const newErrors: { username?: string; room?: string; password?: string } = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (joinType === 'public') {
      if (!room) {
        newErrors.room = 'Please select a public room';
      } else if (!publicRooms.some((r) => r.name === room)) {
        newErrors.room = 'Selected public room does not exist';
      }
    } else {
      if (!room) {
        newErrors.room = 'Room name is required';
      }
      if (!password) {
        newErrors.password = 'Password is required for private rooms';
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setJoining(true);
    if (joinType === 'public') {
      socket.emit('join_room', { username, room });
    } else {
      socket.emit('join_room', { username, room, password });
    }
  };

  const joinDisabled =
    joining ||
    !username ||
    (joinType === 'public' ? !room : !room || !password);

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="w-full">
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 w-full backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center gap-4 text-center pb-8">
            
            
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Join Room
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your details to join a chat room
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
              <div className="space-y-6">
            <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Name</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="on"
                    className="border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900 transition-all duration-300"
              />
              {errors.username && (
                    <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.username}
                    </div>
              )}
            </div>

                <div className="flex gap-3">
              <Button 
                variant={joinType === 'public' ? 'default' : 'outline'} 
                onClick={() => setJoinType('public')}
                    className={`flex-1 flex items-center gap-2 h-12 font-semibold transition-all duration-300 ${
                      joinType === 'public' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg' 
                        : 'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    Public Room
              </Button>
              <Button 
                variant={joinType === 'private' ? 'default' : 'outline'} 
                onClick={() => setJoinType('private')}
                    className={`flex-1 flex items-center gap-2 h-12 font-semibold transition-all duration-300 ${
                      joinType === 'private' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg' 
                        : 'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    Private Room
              </Button>
            </div>

            {joinType === 'public' ? (
              <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select a Public Room</Label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto chat-scrollbar rounded-lg p-1 border border-gray-200 dark:border-gray-700" style={{ overflowX: 'hidden' }}>
                  {publicRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-6">
                      <span className="text-3xl mb-2">😕</span>
                      <span className="font-medium">No public room available at this time</span>
                    </div>
                  ) : (
                    publicRooms.map((r) => (
                      <div
                        key={r.name}
                        className={`flex items-center gap-3 cursor-pointer rounded-lg px-4 py-3 border transition-all shadow-sm
                              ${room === r.name ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-600'}
                        `}
                        onClick={() => setRoom(room === r.name ? '' : r.name)}
                        style={{ userSelect: 'none', width: '100%' }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={room === r.name}
                      >
                        <input
                          type="radio"
                          name="publicRoom"
                          value={r.name}
                          checked={room === r.name}
                          readOnly
                              className="form-radio h-5 w-5 text-indigo-600 accent-indigo-600 pointer-events-none"
                          style={{ minWidth: 20 }}
                          tabIndex={-1}
                        />
                        <span className="font-semibold text-lg flex items-center gap-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span className="truncate">
                            {r.name.length > 20 ? 
                              r.name.split(' ').slice(0, 2).join(' ') + '...' : 
                              r.name
                            }
                          </span>
                          <span className="text-sm opacity-80 flex-shrink-0">({r.users.length} users)</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                      <Label htmlFor="room" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Room Name</Label>
                  <Input
                    id="room"
                    placeholder="Enter the room name"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    autoComplete="on"
                        className="border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900 transition-all duration-300"
                  />
                  {errors.room && (
                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          {errors.room}
                        </div>
                  )}
                </div>
                <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter the room password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="on"
                        className="border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900 transition-all duration-300"
                  />
                  {errors.password && (
                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          {errors.password}
                        </div>
                  )}
                </div>
              </>
            )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={onBack} 
                    className="flex-1 flex items-center gap-2 h-12 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleJoin} 
                disabled={joinDisabled}
                    className="flex-1 flex items-center gap-2 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                    <LogIn className="h-4 w-4" />
                    {joining ? 'Joining...' : 'Join Room'}
              </Button>
            </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinRoom;
