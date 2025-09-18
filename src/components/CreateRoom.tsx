import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Socket } from 'socket.io-client';
import { PlusCircle, Lock, Globe, ArrowLeft } from 'lucide-react';

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

  const MIN_ROOM_NAME_LENGTH = 3;
  const MAX_ROOM_NAME_LENGTH = 25;

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
    setErrors({});

    const roomNameError = validateRoomName(roomName);

    if (roomNameError) {
      setErrors(prev => ({ ...prev, roomName: roomNameError }));
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    setIsCreating(true);
    socket.emit('create_room', {
      roomName: roomName.trim(),
      isPublic,
      password: isPublic ? undefined : password.trim()
    });
  };

  socket.once('room_created', (room) => {
    setIsCreating(false);
    onRoomCreated(room);
  });

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

    if (errors.roomName) {
      setErrors(prev => ({ ...prev, roomName: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

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
    <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl">
        <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your Room
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Set up a new chat room and invite others to join your conversation.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-xl shadow-sm">
                <PlusCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Easy Setup</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Create rooms in seconds with our simple interface</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl shadow-sm">
                <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Secure & Private</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Password protection for private conversations</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 shadow-sm">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded-xl shadow-sm">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Public or Private</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Choose between public rooms or private ones</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center order-1 lg:order-2">
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 w-full max-w-lg backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center gap-4 text-center pb-8">
           
              
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Create New Room
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Set up your chat room in just a few steps
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roomName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="Enter a name for your room"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    autoComplete="on"
                    disabled={isCreating}
                    className={`border-2 focus:ring-2 transition-all duration-300 ${errors.roomName
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900'
                        : characterCount > MAX_ROOM_NAME_LENGTH
                          ? 'border-orange-300 focus:border-orange-400 focus:ring-orange-200 dark:border-orange-600 dark:focus:border-orange-500 dark:focus:ring-orange-900'
                          : 'border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900'
                      }`}
                  />
                  <div className={`text-xs ${characterCount > MAX_ROOM_NAME_LENGTH
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

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={isCreating}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <div className="flex items-center gap-2">
                    {isPublic ? <Globe className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-purple-600" />}
                    <Label htmlFor="isPublic" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      {isPublic ? 'Public Room' : 'Private Room'}
                    </Label>
                  </div>
                </div>

                {!isPublic && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a password"
                      value={password}
                      onChange={handlePasswordChange}
                      autoComplete="on"
                      disabled={isCreating}
                      className={`border-2 focus:ring-2 transition-all duration-300 ${errors.password
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900'
                          : password.length > 20
                            ? 'border-orange-300 focus:border-orange-400 focus:ring-orange-200 dark:border-orange-600 dark:focus:border-orange-500 dark:focus:ring-orange-900'
                            : 'border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900'
                        }`}
                    />
                    <div className={`text-xs ${password.length > 20
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

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 flex items-center gap-2 h-12 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    disabled={isCreating}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleCreate}
                    className="flex-1 flex items-center gap-2 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={!canCreate}
                  >
                    <PlusCircle className="h-4 w-4" />
                    {isCreating ? 'Creating...' : 'Create Room'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom; 