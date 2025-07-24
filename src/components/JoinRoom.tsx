import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Socket } from 'socket.io-client';
import { useState, useEffect } from "react";

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join a Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Your Name</Label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="on"
            />
            {errors.username && (
              <div className="text-red-500 text-xs mt-1">{errors.username}</div>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <Button variant={joinType === 'public' ? 'default' : 'outline'} onClick={() => setJoinType('public')}>Join Public Room</Button>
            <Button variant={joinType === 'private' ? 'default' : 'outline'} onClick={() => setJoinType('private')}>Join Private Room</Button>
          </div>

          {joinType === 'public' ? (
            <div className="space-y-2">
              <Label>Select a Public Room</Label>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto" style={{ overflowX: 'hidden' }}>
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
                        ${room === r.name ? 'bg-gradient-to-r from-purple-500 to-blue-400 text-white border-transparent' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 hover:bg-purple-50 dark:hover:bg-gray-600'}
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
                        className="form-radio h-5 w-5 text-purple-600 accent-purple-600 pointer-events-none"
                        style={{ minWidth: 20 }}
                        tabIndex={-1}
                      />
                      <span className="font-semibold text-lg" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name} <span className="text-sm opacity-80">({r.users.length} users)</span></span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="room">Room Name</Label>
                <Input
                  id="room"
                  placeholder="Enter the room name"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  autoComplete="on"
                />
                {errors.room && (
                  <div className="text-red-500 text-xs mt-1">{errors.room}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter the room password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="on"
                />
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button onClick={handleJoin} disabled={joinDisabled}>
              {joining ? 'Joining...' : 'Join'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinRoom;
