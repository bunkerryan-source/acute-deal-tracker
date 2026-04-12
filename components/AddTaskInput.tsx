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

  return (
    <form onSubmit={handleSubmit} className="px-3 pb-3 pt-1">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="+ Add task"
        disabled={submitting}
        className="w-full rounded-lg border border-dashed border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-teal-500 focus:bg-white disabled:opacity-50"
      />
    </form>
  );
}
