"use client";

import { AcuteLockup } from "./Brand";

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

export default function TopBar({ onOpenMobileSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-2/40 bg-navy px-5 py-3 text-white sm:px-7">
      {/* Mobile menu button */}
      <button
        onClick={onOpenMobileSidebar}
        className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {/* Decorative triangle (8% white) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 160 160"
        className="pointer-events-none absolute"
        style={{ bottom: -30, right: -30, width: 160, height: 160, opacity: 0.08 }}
      >
        <path d="M160 50 L50 160 L160 160 Z" fill="#fff" />
      </svg>

      {/* Lockup + subtitle */}
      <div className="flex items-center gap-3">
        <AcuteLockup size={22} variant="white" />
        <span className="hidden h-[18px] w-px bg-white/20 sm:block" />
        <span className="hidden text-[13px] font-medium text-white/85 sm:block">
          Deal Tracker
        </span>
      </div>

      {/* Right-side spacer (placeholder for future Working-as toggle) */}
      <div className="ml-auto" />
    </header>
  );
}
