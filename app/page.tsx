import Link from 'next/link';
import { ArrowRight, FileText, Globe, Lock, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            Firebase + Google Drive + Next.js 14
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Your Collaborative{' '}
            <span className="text-primary">Workspace</span>
          </h1>
          <p className="mb-10 max-w-2xl mx-auto text-xl text-muted-foreground">
            A production-ready PWA starter kit with real-time collaboration, Google Drive sync,
            and offline-first support.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Everything you need</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Real-time Documents',
                desc: 'Collaborate on documents with live updates powered by Firestore.',
              },
              {
                icon: Globe,
                title: 'Google Drive Sync',
                desc: 'Automatic backup and sync to Google Drive with conflict resolution.',
              },
              {
                icon: Lock,
                title: 'Secure Auth',
                desc: 'Firebase Authentication with Google OAuth and email/password support.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js 14, Firebase, Tailwind CSS &amp; Shadcn UI</p>
      </footer>
    </main>
  );
}
