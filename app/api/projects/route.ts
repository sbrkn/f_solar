import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkspaceProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/services/firestore.service';
import { projectSchema } from '@/lib/utils/validation';

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

    const projects = await getWorkspaceProjects(workspaceId);
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { workspaceId, ownerId } = body;
    if (!workspaceId || !ownerId) {
      return NextResponse.json(
        { error: 'workspaceId and ownerId are required' },
        { status: 400 }
      );
    }

    const project = await createProject({
      name: parsed.data.name,
      description: parsed.data.description || '',
      workspaceId,
      ownerId,
      color: parsed.data.color || '#f97316',
      icon: '📁',
      documentIds: [],
      tags: [],
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
