"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
    setDone(true);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 text-2xl font-semibold">Kayıt Ol</h1>
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
        <Button type="submit" className="w-full">
          Hesap Oluştur
        </Button>
      </form>
      {done && <p className="mt-4 text-sm text-green-700">Hesabınız oluşturuldu.</p>}
    </main>
  );
}
