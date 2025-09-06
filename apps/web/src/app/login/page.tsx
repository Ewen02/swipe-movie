"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/atoms/Button";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        variant="primary"
        onClick={() => signIn("google", { callbackUrl: "/rooms" })}
      >
        Se connecter avec Google
      </Button>
    </div>
  );
}