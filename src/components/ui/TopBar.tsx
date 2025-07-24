import React from "react";

interface TopBarProps {
  onBack?: () => void;
  onExit?: () => void;
  showBack?: boolean;
  showExit?: boolean;
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  onBack,
  onExit,
  showBack,
  showExit,
  title = "Chat Vibe",
}) => (
  <div className="w-full flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-700 shadow-md">
    <div>
      {showBack && (
        <button
          onClick={onBack}
          className="flex items-center text-white font-semibold hover:underline"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
    </div>
    <div className="text-xl font-bold text-white tracking-wide">{title}</div>
    <div>
      {showExit && (
        <button
          onClick={onExit}
          className="flex items-center text-white font-semibold hover:underline"
        >
          Exit Room
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default TopBar; 