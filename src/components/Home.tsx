import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, LogIn, Users, Shield, Zap } from "lucide-react";

interface HomeProps {
  setMode: (mode: "home" | "create" | "join" | "chat") => void;
}

export default function Home({ setMode }: HomeProps) {
  return (
    <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl">
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
              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-xl shadow-sm">
                  <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Lightning Fast</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Real-time messaging with instant delivery and updates</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl shadow-sm">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Multi-User Support</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Connect with multiple users in public or private rooms</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-xl shadow-sm">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Secure & Private</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">End-to-end encryption and password-protected rooms</p>
                </div>
              </div>
            </div>
          </div>
        <div className="flex items-center justify-center order-1 lg:order-2">
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 w-full max-w-lg backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center gap-4 text-center pb-8">
             
              
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome to Toki
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  Real-time chat platform for seamless communication
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-8 pb-8">
              <Button
                className="w-full flex items-center gap-3 h-12 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setMode("create")}
              >
                <PlusCircle className="h-5 w-5" />
                Create New Room
              </Button>
              <Button
                className="w-full flex items-center gap-3 h-12 text-base font-semibold border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transform hover:scale-105 transition-all duration-300"
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