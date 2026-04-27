"use client";

import { useState, FormEvent } from "react";

interface AddTaskInputProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  }

  const showAddButton = title.trim().length > 0 && !submitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 border-t border-ink-06 bg-paper px-[18px] py-2.5"
    >
      <svg
        className="h-[14px] w-[14px] shrink-0 text-ink-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
      </svg>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task..."
        disabled={submitting}
        className="flex-1 bg-transparent text-[13px] text-ink placeholder-ink-40 outline-none disabled:opacity-50"
      />
      {showAddButton && (
        <button
          type="submit"
          className="rounded-[3px] bg-terra px-2 py-[3px] uppercase tracking-[0.06em] text-white hover:bg-terra-muted"
          style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10 }}
        >
          Add ↵
        </button>
      )}
    </form>
  );
}
