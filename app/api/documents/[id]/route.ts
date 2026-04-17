import { getAdminDb } from "@/lib/firebase-admin";
import { requireDocumentAccess, requireUser } from "@/lib/server/authorize";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/[id]
 * Returns the document. The authenticated user must be a viewer (or higher) of its workspace.
 */
export async function GET(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const { id } = await params;

  let access;
  try {
    access = await requireDocumentAccess(user.uid, id, "viewer");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  return NextResponse.json({ id, ...access.data });
}

/**
 * PATCH /api/documents/[id]
 * Partially updates the document. The authenticated user must be an editor or owner.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const { id } = await params;

  try {
    await requireDocumentAccess(user.uid, id, "editor");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, content } = body;
  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;

  await getAdminDb().collection("documents").doc(id).update(updateData);
  return NextResponse.json({ id });
}

/**
 * PUT /api/documents/[id]
 * Replaces the document content. The authenticated user must be an editor or owner.
 */
export async function PUT(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const { id } = await params;

  try {
    await requireDocumentAccess(user.uid, id, "editor");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, content = "" } = body;
  await getAdminDb().collection("documents").doc(id).update({
    title: title ?? "Untitled",
    content,
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ id });
}

/**
 * DELETE /api/documents/[id]
 * Deletes the document. The authenticated user must be an owner.
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const { id } = await params;

  try {
    await requireDocumentAccess(user.uid, id, "owner");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  await getAdminDb().collection("documents").doc(id).delete();
  return new NextResponse(null, { status: 204 });
}
