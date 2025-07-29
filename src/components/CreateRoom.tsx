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
  const [isCreating, setIsCreating] = useState(false);

  // Room name validation constants
  const MIN_ROOM_NAME_LENGTH = 3;
  const MAX_ROOM_NAME_LENGTH = 30;

  const validateRoomName = (name: string): string | null => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return 'Room name is required';
    }
    
    if (trimmedName.length < MIN_ROOM_NAME_LENGTH) {
      return `Room name must be at least ${MIN_ROOM_NAME_LENGTH} characters`;
    }
    
    if (trimmedName.length > MAX_ROOM_NAME_LENGTH) {
      return `Room name cannot exceed ${MAX_ROOM_NAME_LENGTH} characters`;
    }
    
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return 'Room name can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    
    return null;
  };

  const validatePassword = (pass: string): string | null => {
    if (!isPublic) {
      if (!pass.trim()) {
        return 'Password is required for private rooms';
      }
      if (pass.length < 4) {
        return 'Password must be at least 4 characters';
      }
      if (pass.length > 20) {
        return 'Password cannot exceed 20 characters';
      }
    }
    return null;
  };

  const handleCreate = () => {
    // Clear previous errors
    setErrors({});
    
    // Validate room name
    const roomNameError = validateRoomName(roomName);
    
    if (roomNameError) {
      setErrors(prev => ({ ...prev, roomName: roomNameError }));
      return; // Stop here if room name is invalid
    }
    
    // Validate password for private rooms
    const passwordError = validatePassword(password);
    
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      return; // Stop here if password is invalid
    }
    
    // If all validations pass, create room
    setIsCreating(true);
    socket.emit('create_room', { 
      roomName: roomName.trim(), 
      isPublic, 
      password: isPublic ? undefined : password.trim() 
    });
  };

  // Handle room creation response
  socket.once('room_created', (room) => {
    setIsCreating(false);
    onRoomCreated(room);
  });

  // Handle room creation errors from server
  socket.once('error', (errorMessage) => {
    setIsCreating(false);
    if (errorMessage.toLowerCase().includes('room') || errorMessage.toLowerCase().includes('name')) {
      setErrors(prev => ({ ...prev, roomName: errorMessage }));
    } else {
      setErrors(prev => ({ ...prev, roomName: 'Failed to create room. Please try again.' }));
    }
  });

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoomName(value);
    
    // Clear room name error when user starts typing
    if (errors.roomName) {
      setErrors(prev => ({ ...prev, roomName: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear password error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const characterCount = roomName.length;
  const trimmedRoomName = roomName.trim();
  const isRoomNameValid = trimmedRoomName.length >= MIN_ROOM_NAME_LENGTH && 
                         trimmedRoomName.length <= MAX_ROOM_NAME_LENGTH && 
                         /^[a-zA-Z0-9\s\-_]+$/.test(trimmedRoomName) &&
                         !errors.roomName;
  
  const isPasswordValid = isPublic || 
                         (password.trim().length >= 4 && 
                          password.trim().length <= 20 && 
                          !errors.password);
  
  const canCreate = isRoomNameValid && isPasswordValid && !isCreating;

  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create a New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="Enter a name for your room"
                value={roomName}
                onChange={handleRoomNameChange}
                autoComplete="on"
                disabled={isCreating}
                className={`border-2 focus:ring-2 transition-colors ${
                  errors.roomName 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900' 
                    : characterCount > MAX_ROOM_NAME_LENGTH
                    ? 'border-orange-300 focus:border-orange-400 focus:ring-orange-200 dark:border-orange-600 dark:focus:border-orange-500 dark:focus:ring-orange-900'
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900'
                }`}
              />
              <div className={`text-xs ${
                characterCount > MAX_ROOM_NAME_LENGTH 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {characterCount}/{MAX_ROOM_NAME_LENGTH} characters
              </div>
              {errors.roomName && (
                <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.roomName}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isCreating}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                  onChange={handlePasswordChange}
                  autoComplete="on"
                  disabled={isCreating}
                  className={`border-2 focus:ring-2 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900' 
                      : password.length > 20
                      ? 'border-orange-300 focus:border-orange-400 focus:ring-orange-200 dark:border-orange-600 dark:focus:border-orange-500 dark:focus:ring-orange-900'
                      : 'border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900'
                  }`}
                />
                <div className={`text-xs ${
                  password.length > 20 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {password.length}/20 characters
                </div>
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.password}
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="flex-1 mr-2"
                disabled={isCreating}
              >
                Back
              </Button>
              <Button 
                onClick={handleCreate} 
                className="flex-1 ml-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canCreate}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoom; 