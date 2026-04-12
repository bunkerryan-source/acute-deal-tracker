"use client";

import { useState, useRef, useEffect } from "react";

interface CategoryHeaderProps {
  name: string;
  taskCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function CategoryHeader({
  name,
  taskCount,
  isCollapsed,
  onToggleCollapse,
  onRename,
  onDelete,
  canDelete,
}: CategoryHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleSave() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setEditName(name);
    }
    setIsEditing(false);
  }

  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <button
        onClick={onToggleCollapse}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            isCollapsed ? "" : "rotate-90"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditName(name);
              setIsEditing(false);
            }
          }}
          className="flex-1 rounded border border-teal-500 bg-white px-2 py-0.5 text-sm font-semibold text-gray-900 outline-none ring-2 ring-teal-500/20"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 text-left text-sm font-semibold text-gray-900 hover:text-teal-700"
        >
          {name}
        </button>
      )}

      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
        {taskCount}
      </span>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:text-red-500"
          title="Delete category (empty)"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
