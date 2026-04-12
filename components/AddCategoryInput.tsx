"use client";

import { useState, FormEvent } from "react";

interface AddCategoryInputProps {
  onAdd: (name: string) => Promise<void>;
}

export default function AddCategoryInput({ onAdd }: AddCategoryInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setName("");
      setIsOpen(false);
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          + Add Category
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          autoFocus
          disabled={submitting}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              setName("");
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setName("");
          }}
          className="rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
