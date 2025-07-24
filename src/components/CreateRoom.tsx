import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Socket } from 'socket.io-client';

interface CreateRoomProps {
  socket: Socket;
  onRoomCreated: (room: any) => void;
  onBack: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ socket, onRoomCreated, onBack }) => {
  const [roomName, setRoomName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ roomName?: string; password?: string }>({});

  const handleCreate = () => {
    const newErrors: { roomName?: string; password?: string } = {};
    if (!roomName) {
      newErrors.roomName = 'Room name is required';
    }
    if (!isPublic && !password) {
      newErrors.password = 'Password is required for private rooms';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    socket.emit('create_room', { roomName, isPublic, password: isPublic ? undefined : password });
  };

  socket.once('room_created', (room) => {
    onRoomCreated(room);
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create a New Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              placeholder="Enter a name for your room"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoComplete="on"
            />
            {errors.roomName && (
              <div className="text-red-500 text-xs mt-1">{errors.roomName}</div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <Label htmlFor="isPublic">Public Room</Label>
          </div>
          {!isPublic && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
              />
              {errors.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
              )}
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateRoom; 