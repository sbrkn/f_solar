import { Metadata } from 'next';
import { ProjectList } from '@/components/workspace/project-list';

export const metadata: Metadata = {
  title: 'Projects - F-Solar Workspace',
};

export default function ProjectsPage() {
  return <ProjectList />;
}
