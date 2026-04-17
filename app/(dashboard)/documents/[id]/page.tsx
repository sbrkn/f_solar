import { Metadata } from 'next';
import DocumentEditor from '@/components/editor/document-editor';

export const metadata: Metadata = { title: 'Edit Document' };

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DocumentEditor documentId={id} />;
}
