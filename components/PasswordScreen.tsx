"use client";

import { useState, FormEvent } from "react";
import { AcuteLockup } from "./Brand";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone px-4">
      {/* Decorative triangle (8% navy) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 360"
        className="pointer-events-none absolute"
        style={{ bottom: -80, right: -80, width: 360, height: 360, opacity: 0.08 }}
      >
        <path d="M360 120 L120 360 L360 360 Z" fill="#0E1E3A" />
      </svg>

      <div
        className={`relative w-full max-w-[380px] rounded-lg border border-ink-10 bg-white px-9 pb-8 pt-9 ${
          shaking ? "animate-shake" : ""
        }`}
      >
        <div className="flex justify-center">
          <AcuteLockup size={26} />
        </div>
        <h1 className="mt-5 text-center text-[18px] font-medium text-ink">
          Acute Deal Tracker
        </h1>
        <p className="mt-1 mono-label text-center">
          Enter password to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            className={`w-full rounded border px-3.5 py-3 text-[14px] text-ink placeholder-ink-40 outline-none transition-colors focus:ring-2 ${
              error
                ? "border-terra focus:border-terra focus:ring-terra/20"
                : "border-ink-20 focus:border-terra focus:ring-terra/20"
            }`}
          />
          {error && (
            <p className="mt-2 mono-label text-terra">Incorrect password</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded bg-terra py-3 text-[14px] font-medium text-white transition-colors hover:bg-terra-muted"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
