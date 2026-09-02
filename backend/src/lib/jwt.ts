import { jwtVerify, SignJWT } from "jose";

import { env } from "../env.ts";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const issuer = "financy-api";
const audience = "financy-app";

export function signToken(userId: string) {
  return new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { issuer, audience });
  return payload.sub ?? null;
}
