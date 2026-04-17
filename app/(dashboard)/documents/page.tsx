import { Metadata } from 'next';
import DocumentList from '@/components/workspace/document-list';

export const metadata: Metadata = { title: 'Documents' };

export default function DocumentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your documents</p>
        </div>
      </div>
      <DocumentList />
    </div>
  );
}
