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
          className="w-full rounded-md border border-dashed border-ink-20 py-3.5 text-[13px] font-medium text-ink-60 transition-colors hover:border-ink-40 hover:text-navy"
        >
          + Add category
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
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
          className="flex-1 rounded border border-ink-20 px-3.5 py-2.5 text-[14px] text-ink placeholder-ink-40 outline-none focus:border-terra focus:ring-2 focus:ring-terra/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded bg-terra px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-terra-muted disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setName("");
          }}
          className="rounded px-3 py-2.5 text-[14px] text-ink-60 hover:bg-ink-06 hover:text-navy"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
