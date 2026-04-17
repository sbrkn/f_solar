import { Metadata } from 'next';
import { DocumentList } from '@/components/workspace/document-list';

export const metadata: Metadata = {
  title: 'Documents - F-Solar Workspace',
};

export default function DocumentsPage() {
  return <DocumentList />;
}
