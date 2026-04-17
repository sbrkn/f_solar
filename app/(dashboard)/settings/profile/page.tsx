import { Metadata } from 'next';
import { ProfilePage } from '@/components/workspace/profile-page';

export const metadata: Metadata = {
  title: 'Profile Settings - F-Solar Workspace',
};

export default function Profile() {
  return <ProfilePage />;
}
