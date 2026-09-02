import argon2 from "argon2";

const dummyHash = await argon2.hash(crypto.randomUUID());

export function hashPassword(plain: string) {
  return argon2.hash(plain);
}

export function verifyPassword(hash: string, plain: string) {
  return argon2.verify(hash, plain).catch(() => false);
}

export function verifyDummyPassword() {
  return argon2.verify(dummyHash, "financy").catch(() => false);
}
