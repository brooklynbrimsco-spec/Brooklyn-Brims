import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { connection } from "next/server";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

const globalForDb = globalThis as typeof globalThis & {
  __bb_pg_pool?: pg.Pool;
  __bb_pglite?: Promise<PGlite>;
};

export async function sql<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await connection();
  if (databaseUrl !== "") {
    globalForDb.__bb_pg_pool ??= new pg.Pool({
      connectionString: databaseUrl,
      max: 5,
    });
    return (await globalForDb.__bb_pg_pool.query(text, params)).rows as T[];
  }
  globalForDb.__bb_pglite ??= startLocal().catch((error: unknown) => {
    globalForDb.__bb_pglite = undefined;
    throw error;
  });
  return (await (await globalForDb.__bb_pglite).query<T>(text, params)).rows;
}

async function startLocal(): Promise<PGlite> {
  const db = new PGlite();
  const files = (await readdir("migrations").catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await db.exec(await readFile(`migrations/${file}`, "utf8"));
  }
  return db;
}
