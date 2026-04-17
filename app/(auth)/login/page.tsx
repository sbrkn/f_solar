import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - F-Solar Workspace',
};

export default function LoginPage() {
  return <LoginForm />;
}
