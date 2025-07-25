import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 px-4 flex flex-col md:flex-row items-center justify-center gap-2 shadow-lg">
    <span className="flex items-center gap-2 text-xs md:text-sm text-center">
      <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
      <p className="text-md px-1">&copy; {new Date().getFullYear()} Toki | All Rights Reserved | Developed by <a className="underline" href="https://shahzadali.vercel.app/" target="_blank" rel="noopener noreferrer">Shahzad Ali</a></p>
    </span>
  </footer>
);

export default Footer; 