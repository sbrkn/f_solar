import { NextRequest, NextResponse } from 'next/server';
import {
  getDocumentById,
  updateDocumentContent,
  updateDocumentTitle,
  archiveDocument,
  deleteDocumentSoft,
} from '@/services/firestore.service';
import { updateDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await getDocumentById(params.id);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ data: document });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, userId, tags, status } = body;

    if (title !== undefined) {
      await updateDocumentTitle(params.id, title);
    }
    if (content !== undefined && userId) {
      await updateDocumentContent(params.id, content, userId);
    }
    if (tags !== undefined || status !== undefined) {
      await updateDocument(COLLECTIONS.DOCUMENTS, params.id, {
        ...(tags !== undefined && { tags }),
        ...(status !== undefined && { status }),
      });
    }

    const updated = await getDocumentById(params.id);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDocumentSoft(params.id);
    return NextResponse.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
