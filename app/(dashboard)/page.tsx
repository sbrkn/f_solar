import { Metadata } from 'next';
import { DashboardPage } from '@/components/workspace/dashboard-page';

export const metadata: Metadata = {
  title: 'Dashboard - F-Solar Workspace',
};

export default function Dashboard() {
  return <DashboardPage />;
}
