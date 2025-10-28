import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 shadow-lg">
                <img 
                  src="/favicon.ico" 
                  alt="Toki Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-3xl tracking-tight drop-shadow-lg bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                    Toki
                  </span>
                  <Sparkles className="h-5 w-5 text-pink-400 animate-pulse" />
                </div>
                <span className="text-xs font-medium text-gray-300 tracking-wide">
                  Real-time Chat Platform
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Connect with friends, family, and colleagues in real-time. Create private or public chat rooms 
              and enjoy seamless communication with our modern chat platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Features</h4>
            <ul className="space-y-3">
              <li className="text-gray-300 text-sm">
                Real-time Messaging
              </li>
              <li className="text-gray-300 text-sm">
                Public & Private Rooms
              </li>
              <li className="text-gray-300 text-sm">
                Message History
              </li>
              <li className="text-gray-300 text-sm">
                Typing Indicators
              </li>
              <li className="text-gray-300 text-sm">
                Dark Mode Support
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>&copy; {currentYear} Toki. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Developed by</span>
              <a 
                href="https://shahzadali.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >Shahzad Ali
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 