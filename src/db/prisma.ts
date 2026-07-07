import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  databaseConnectionPromise?: Promise<void>;
  prisma?: PrismaClient;
};

function formatDatabaseTarget(connectionString: string) {
  try {
    const url = new URL(connectionString);

    return `${url.protocol}//${url.hostname}:${url.port || "5432"}${url.pathname}`;
  } catch {
    return "configured database";
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

export function ensureDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    const error = new Error("DATABASE_URL is not set.");
    console.error("[database] Connection failed", error);

    return Promise.reject(error);
  }

  globalForPrisma.databaseConnectionPromise ??= prisma
    .$connect()
    .then(() => prisma.$queryRaw`SELECT 1`)
    .then(() => {
      console.info(
        `[database] Connected to ${formatDatabaseTarget(databaseUrl)}`,
      );
    })
    .catch((error: unknown) => {
      globalForPrisma.databaseConnectionPromise = undefined;
      console.error(
        `[database] Connection failed for ${formatDatabaseTarget(databaseUrl)}`,
        error,
      );

      throw error;
    });

  return globalForPrisma.databaseConnectionPromise;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
