import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '@/services/firestore.service';
import { adminAuth } from '@/lib/firebase/admin';

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId');
  if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 });

  const documents = await firestoreService.getDocuments(workspaceId);
  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, content = '', workspaceId, projectId, tags = [] } = body;

  if (!title || !workspaceId) {
    return NextResponse.json({ error: 'title and workspaceId are required' }, { status: 400 });
  }

  const id = await firestoreService.createDocument({
    title,
    content,
    workspaceId,
    projectId,
    authorId: uid,
    tags,
    isArchived: false,
    isTrashed: false,
    collaborators: [uid],
    lastEditedBy: uid,
  });

  return NextResponse.json({ id }, { status: 201 });
}
