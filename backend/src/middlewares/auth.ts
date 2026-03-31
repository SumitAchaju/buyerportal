import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export async function requireAuth(req: Req, res: Res, next: Next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.error("Unauthorized", 401);
    return;
  }

  req.user = {
    ...session.user,
    image: session.user.image ?? null,
  };
  req.session = {
    ...session.session,
    ipAddress: session.session.ipAddress ?? null,
    userAgent: session.session.userAgent ?? null,
  };
  next();
}
