import { unauthenticated } from "../lib/errors.ts";
import { verifyToken } from "../lib/jwt.ts";

export interface Context {
  userId: string | null;
}

export async function buildContext({
  request,
}: {
  request: Request;
}): Promise<Context> {
  const header = request.headers.get("authorization");

  if (header?.startsWith("Bearer ")) {
    try {
      return { userId: await verifyToken(header.slice("Bearer ".length)) };
    } catch {}
  }

  return { userId: null };
}

export function requireAuth(context: Context): string {
  if (!context.userId) throw unauthenticated();
  return context.userId;
}
