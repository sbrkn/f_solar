"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 text-2xl font-semibold">Giriş Yap</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-md border border-border p-2"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-border p-2"
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">
          Giriş
        </Button>
      </form>
    </main>
  );
}
