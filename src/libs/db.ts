// apps/api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Dev Global Singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const client =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
