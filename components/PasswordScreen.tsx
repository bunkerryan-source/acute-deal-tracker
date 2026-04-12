"use client";

import { useState, FormEvent } from "react";

interface PasswordScreenProps {
  onLogin: (password: string) => boolean;
}

export default function PasswordScreen({ onLogin }: PasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div
        className={`w-full max-w-sm rounded-xl bg-white p-8 shadow-sm border border-gray-200 ${
          shaking ? "animate-shake" : ""
        }`}
      >
        <h1 className="mb-1 text-center text-xl font-semibold text-gray-900">
          Acute Deal Tracker
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter password to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">Incorrect password</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:bg-teal-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
