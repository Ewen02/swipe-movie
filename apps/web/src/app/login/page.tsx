"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/rooms" })}
      >
        Se connecter avec Google
      </button>
    </div>
  );
}