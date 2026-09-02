import { emailTaken, invalidCredentials } from "../lib/errors.ts";
import { signToken } from "../lib/jwt.ts";
import {
  hashPassword,
  verifyDummyPassword,
  verifyPassword,
} from "../lib/password.ts";
import { prisma } from "../lib/prisma.ts";
import { serializeUser } from "../lib/serialize.ts";
import { loginSchema, parseInput, registerSchema } from "../lib/validation.ts";

export async function register(data: unknown) {
  const input = parseInput(registerSchema, data);

  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existing) throw emailTaken();

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    },
  });

  return { token: await signToken(user.id), user: serializeUser(user) };
}

export async function login(data: unknown) {
  const input = parseInput(loginSchema, data);

  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    await verifyDummyPassword();
    throw invalidCredentials();
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) throw invalidCredentials();

  return { token: await signToken(user.id), user: serializeUser(user) };
}
