import { Metadata } from 'next';
import { SettingsPage } from '@/components/workspace/settings-page';

export const metadata: Metadata = {
  title: 'Settings - F-Solar Workspace',
};

export default function Settings() {
  return <SettingsPage />;
}
