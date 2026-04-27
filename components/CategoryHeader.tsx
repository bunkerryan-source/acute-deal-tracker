"use client";

import { useState, useRef, useEffect } from "react";

interface CategoryHeaderProps {
  name: string;
  doneCount: number;
  totalCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function CategoryHeader({
  name,
  doneCount,
  totalCount,
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
    <div
      className={`flex items-center gap-2.5 bg-stone-2 px-[18px] py-[14px] ${
        isCollapsed ? "" : "border-b border-ink-10"
      }`}
    >
      <button
        onClick={onToggleCollapse}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-60 hover:text-ink"
      >
        <svg
          className={`h-[14px] w-[14px] transition-transform duration-200 ${
            isCollapsed ? "" : "rotate-90"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
          className="flex-1 rounded border border-terra bg-white px-2 py-0.5 text-[14px] font-semibold text-ink outline-none ring-2 ring-terra/20"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 text-left text-[14px] font-semibold text-ink hover:text-terra"
        >
          {name}
        </button>
      )}

      <span
        className="rounded-[3px] border border-ink-10 bg-white px-2 py-[3px] text-ink-60"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {doneCount}/{totalCount}
      </span>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-ink-20 hover:text-terra"
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
