import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your workspace</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Documents', value: '—', desc: 'Total documents' },
          { label: 'Projects', value: '—', desc: 'Active projects' },
          { label: 'Collaborators', value: '—', desc: 'Team members' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{stat.desc}</p>
            <p className="mt-1 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">No recent activity yet.</p>
      </div>
    </div>
  );
}
