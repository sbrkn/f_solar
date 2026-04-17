import { Metadata } from 'next';
import { DocumentEditor } from '@/components/editor/document-editor';

export const metadata: Metadata = {
  title: 'Document - F-Solar Workspace',
};

export default function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  return <DocumentEditor documentId={params.id} />;
}
