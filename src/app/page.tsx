import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-16">
      <h1 className="text-4xl font-bold">Next.js + Firebase Workspace Starter</h1>
      <p className="max-w-3xl text-muted-foreground">
        AppFlowy tarzı doküman yönetimi, Firestore realtime senkronizasyonu ve Google Drive backup altyapısı için
        başlangıç şablonu.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </main>
  );
}
