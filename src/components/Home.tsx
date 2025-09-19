import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, LogIn, Users, Shield, Zap } from "lucide-react";

interface HomeProps {
  setMode: (mode: "home" | "create" | "join" | "chat") => void;
}

export default function Home({ setMode }: HomeProps) {
  return (
    <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Toki?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Experience the future of real-time communication with our cutting-edge features.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">Lightning Fast</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">Real-time messaging with instant delivery and updates</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">Multi-User Support</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">Connect with multiple users in public or private rooms</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">Secure & Private</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">End-to-end encryption and password-protected rooms</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center order-1 lg:order-2">
          <Card className="shadow-lg border bg-white dark:bg-gray-900 w-full max-w-lg">
            <CardHeader className="flex flex-col items-center gap-4 text-center pb-6">
              <div>
                <CardTitle className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  Welcome to Toki
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Real-time chat platform for seamless communication
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 pb-6">
              <Button
                className="w-full flex items-center gap-3 h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setMode("create")}
              >
                <PlusCircle className="h-5 w-5" />
                Create New Room
              </Button>
              <Button
                className="w-full flex items-center gap-3 h-11 text-base font-semibold border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                variant="outline"
                onClick={() => setMode("join")}
              >
                <LogIn className="h-5 w-5" />
                Join Existing Room
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 