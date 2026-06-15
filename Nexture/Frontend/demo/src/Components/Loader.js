import React from 'react';

// Gaming-themed neon loader (uses Tailwind classes)
export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue opacity-40 filter blur-xl animate-spin" style={{ animationDuration: '3000ms' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-20 h-20 text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]">
              <g fill="currentColor">
                <path d="M6 10c-1.1 0-2 .9-2 2v1c0 1.66 1.34 3 3 3h1l1 1h4l1-1h1c1.66 0 3-1.34 3-3v-1c0-1.1-.9-2-2-2H6z" opacity="0.95" />
                <circle cx="9" cy="12" r="1" className="text-neon-purple" />
                <circle cx="15" cy="12" r="1" className="text-neon-blue" />
                <path d="M8 8c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" fillOpacity="0.9" />
              </g>
            </svg>
          </div>
        </div>
        <div className="text-white text-sm font-semibold tracking-wider">Preparing your loadout...</div>
      </div>
    </div>
  );
}
