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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const document = await firestoreService.getDocument(params.id);
  if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ document });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  await firestoreService.updateDocument(params.id, body, uid);
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await firestoreService.deleteDocument(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
