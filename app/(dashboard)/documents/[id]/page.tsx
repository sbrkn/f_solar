import { Metadata } from 'next';
import DocumentEditor from '@/components/editor/document-editor';

export const metadata: Metadata = { title: 'Edit Document' };

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  return <DocumentEditor documentId={params.id} />;
}
