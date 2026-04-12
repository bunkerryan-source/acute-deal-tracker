"use client";

import { UserName } from "@/lib/database.types";
import UserSelector from "./UserSelector";

interface HeaderProps {
  currentUser: UserName | null;
  onSelectUser: (user: UserName) => void;
}

export default function Header({ currentUser, onSelectUser }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">
          Acute Deal Tracker
        </h1>
        <UserSelector
          currentUser={currentUser}
          onSelectUser={onSelectUser}
        />
      </div>
    </header>
  );
}
