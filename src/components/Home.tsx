import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, PlusCircle, LogIn } from "lucide-react";

interface HomeProps {
  setMode: (mode: "home" | "create" | "join" | "chat") => void;
}

export default function Home({ setMode }: HomeProps) {
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90">
        <CardHeader className="flex flex-col items-center gap-2">
          <Sparkles className="h-12 w-12 text-blue-500 mb-2" />
          <CardTitle className="text-3xl font-bold text-center">Welcome to Toki</CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Effortless real-time chat. Create or join a room to get started!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <Button
            className="w-full flex items-center gap-2"
            size="lg"
            onClick={() => setMode("create")}
          >
            <PlusCircle className="h-5 w-5" />
            Create Room
          </Button>
          <Button
            className="w-full flex items-center gap-2"
            size="lg"
            variant="outline"
            onClick={() => setMode("join")}
          >
            <LogIn className="h-5 w-5" />
            Join Room
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 