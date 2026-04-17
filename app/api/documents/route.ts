import { getAdminDb } from "@/lib/firebase-admin";
import {
  requireUser,
  requireWorkspaceMember,
} from "@/lib/server/authorize";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/documents?workspaceId=...
 * Returns all documents the authenticated user can read in the workspace.
 */
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    await requireWorkspaceMember(user.uid, workspaceId, "viewer");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const snapshot = await getAdminDb()
    .collection("documents")
    .where("workspaceId", "==", workspaceId)
    .get();

  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ documents });
}

/**
 * POST /api/documents
 * Creates a new document. The authenticated user must be an editor or owner of the workspace.
 */
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser(req);
  } catch (errResp) {
    return errResp as NextResponse;
  }

  let body: { workspaceId?: string; title?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { workspaceId, title, content = "" } = body;

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 }
    );
  }

  try {
    await requireWorkspaceMember(user.uid, workspaceId, "editor");
  } catch (errResp) {
    return errResp as NextResponse;
  }

  const docRef = await getAdminDb().collection("documents").add({
    workspaceId,
    title: title ?? "Untitled",
    content,
    createdBy: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
