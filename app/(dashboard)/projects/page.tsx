import { Metadata } from 'next';
import ProjectList from '@/components/workspace/project-list';

export const metadata: Metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Organize documents into projects</p>
      </div>
      <ProjectList />
    </div>
  );
}
