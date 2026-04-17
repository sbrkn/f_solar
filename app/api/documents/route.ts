import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkspaceDocuments,
  createDocument,
} from '@/services/firestore.service';
import { documentSchema } from '@/lib/utils/validation';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    const documents = await getWorkspaceDocuments(workspaceId);
    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = documentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { workspaceId, authorId } = body;
    if (!workspaceId || !authorId) {
      return NextResponse.json(
        { error: 'workspaceId and authorId are required' },
        { status: 400 }
      );
    }

    const document = await createDocument({
      title: parsed.data.title,
      content: parsed.data.content || '',
      projectId: parsed.data.projectId || null,
      workspaceId,
      authorId,
      collaborators: [],
      tags: parsed.data.tags || [],
      status: 'draft',
      deletedAt: null,
      metadata: {
        wordCount: 0,
        readTime: 0,
        lastEditedBy: authorId,
        isTemplate: false,
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
