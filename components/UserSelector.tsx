"use client";

import { UserName } from "@/lib/database.types";

interface UserSelectorProps {
  currentUser: UserName | null;
  onSelectUser: (user: UserName) => void;
}

export default function UserSelector({
  currentUser,
  onSelectUser,
}: UserSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
      {(["Ryan", "Matt"] as UserName[]).map((name) => (
        <button
          key={name}
          onClick={() => onSelectUser(name)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            currentUser === name
              ? "bg-teal-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
