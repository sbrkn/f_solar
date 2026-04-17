import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - F-Solar Workspace',
};

export default function SignupPage() {
  return <SignupForm />;
}
