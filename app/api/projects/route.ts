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

  const projects = await firestoreService.getProjects(workspaceId);
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const uid = await getUserId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description, workspaceId, color } = await request.json();
  if (!name || !workspaceId) {
    return NextResponse.json({ error: 'name and workspaceId are required' }, { status: 400 });
  }

  const id = await firestoreService.createProject({
    name,
    description,
    workspaceId,
    ownerId: uid,
    documentIds: [],
    color,
    isArchived: false,
  });

  return NextResponse.json({ id }, { status: 201 });
}
