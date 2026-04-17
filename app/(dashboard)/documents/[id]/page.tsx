import { Metadata } from 'next';
import { DocumentEditor } from '@/components/editor/document-editor';

export const metadata: Metadata = {
  title: 'Document - F-Solar Workspace',
};

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DocumentEditor documentId={id} />;
}
