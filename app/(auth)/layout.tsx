export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">F Solar</h1>
        <p className="text-sm text-muted-foreground">Collaborative Workspace</p>
      </div>
      {children}
    </div>
  );
}
