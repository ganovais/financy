import { unauthenticated } from "../lib/errors.ts";
import { prisma } from "../lib/prisma.ts";
import { serializeUser } from "../lib/serialize.ts";
import { parseInput, updateProfileSchema } from "../lib/validation.ts";

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw unauthenticated();
  return serializeUser(user);
}

export async function updateProfile(userId: string, data: unknown) {
  const input = parseInput(updateProfileSchema, data);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: input.name },
  });

  return serializeUser(user);
}
