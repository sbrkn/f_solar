import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "session";

/**
 * Verifies the Firebase ID token from the Authorization header or session cookie.
 * Returns the decoded token or throws a NextResponse with status 401.
 */
export async function requireUser(req: NextRequest) {
  let token: string | undefined;

  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies.get(SESSION_COOKIE)?.value;
  }

  if (!token) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded;
  } catch {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/**
 * Verifies that `uid` is a member of `workspaceId` with at least `requiredRole`.
 * Throws a NextResponse with status 403 on failure.
 *
 * Firestore path: workspaces/{workspaceId}/members/{uid}
 * Document shape: { role: "owner" | "editor" | "viewer" }
 */
const ROLE_RANK: Record<string, number> = {
  owner: 3,
  editor: 2,
  viewer: 1,
};

export async function requireWorkspaceMember(
  uid: string,
  workspaceId: string,
  requiredRole: "viewer" | "editor" | "owner" = "viewer"
) {
  const memberDoc = await getAdminDb()
    .collection("workspaces")
    .doc(workspaceId)
    .collection("members")
    .doc(uid)
    .get();

  if (!memberDoc.exists) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = memberDoc.data();
  const role: string = data?.role ?? "";

  if ((ROLE_RANK[role] ?? 0) < (ROLE_RANK[requiredRole] ?? 0)) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { role };
}

/**
 * Loads the document, derives its workspaceId, then delegates to requireWorkspaceMember.
 * Never reveals whether the document exists in the 403 response.
 *
 * Firestore path: documents/{documentId}
 * Document shape: { workspaceId: string, ... }
 */
export async function requireDocumentAccess(
  uid: string,
  documentId: string,
  requiredRole: "viewer" | "editor" | "owner" = "viewer"
) {
  const docSnap = await getAdminDb().collection("documents").doc(documentId).get();

  // Return 403 regardless of whether the document exists to avoid leaking existence.
  if (!docSnap.exists) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = docSnap.data();
  const workspaceId: string | undefined = data?.workspaceId;

  if (!workspaceId) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await requireWorkspaceMember(uid, workspaceId, requiredRole);

  return { workspaceId, data };
}
