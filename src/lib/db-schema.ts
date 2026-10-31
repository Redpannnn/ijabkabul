import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

/**
 * Database helper — koneksi + auto-create tabel.
 *
 * WHY: Sebelumnya user harus manually GET /api/setup buat bikin tabel Rsvp &
 * Guest. Kalau lupa, semua API jalan dengan error "no such table: Rsvp/Guest".
 * Sekarang tabel di-create otomatis (lazy) saat pertama kali dipakai.
 *
 * SELF-CONTAINED: pakai @libsql/client langsung (NGGAK import db.ts/Prisma),
 * jadi tetap jalan walau Prisma build cache rusak.
 */

let ensurePromise: Promise<void> | null = null;

/** Validasi DATABASE_URL — return null kalau invalid/kosong. */
function getValidDbUrl(): string | null {
  const raw = process.env.DATABASE_URL;
  if (!raw) return null;
  const u = raw.trim();
  if (!u || u === "undefined" || u === "null" || u === "UNDEFINED") return null;
  if (
    u.startsWith("file:") ||
    u.startsWith("libsql:") ||
    u.startsWith("http:") ||
    u.startsWith("https:")
  ) {
    return u;
  }
  return null;
}

/** Fallback SQLite file path kalau DATABASE_URL kosong/invalid. */
function getFallbackFileUrl(): string {
  const url = `file:${process.cwd()}/db/custom.db`;
  process.env.DATABASE_URL = url;
  return url;
}

/** Bikin @libsql/client baru setiap kali dipanggil. */
export function getDbClient(): Client {
  const url = getValidDbUrl() ?? getFallbackFileUrl();
  const token = process.env.DATABASE_AUTH_TOKEN;
  return createClient({ url, authToken: token });
}

/**
 * CREATE TABLE IF NOT EXISTS untuk Rsvp & Guest.
 * Aman dipanggil berkali-kali. Pakai memoization supaya query cuma sekali
 * per cold-start process.
 */
export async function ensureSchema(): Promise<void> {
  if (ensurePromise) return ensurePromise;
  ensurePromise = (async () => {
    const client = getDbClient();
    try {
      await client.batch([
        {
          sql: `CREATE TABLE IF NOT EXISTS "Rsvp" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "attendance" TEXT NOT NULL,
            "count" INTEGER NOT NULL DEFAULT 1,
            "message" TEXT,
            "createdAt" TEXT NOT NULL
          )`,
          args: [],
        },
        {
          sql: `CREATE TABLE IF NOT EXISTS "Guest" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "code" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "createdAt" TEXT NOT NULL
          )`,
          args: [],
        },
        {
          sql: `CREATE UNIQUE INDEX IF NOT EXISTS "Guest_code_key" ON "Guest"("code")`,
          args: [],
        },
      ], "write");
    } finally {
      try {
        await client.close();
      } catch {
        // ignore
      }
    }
  })();
  return ensurePromise;
}

/** Cuid-like id generator: timestamp + random. */
export function genId(): string {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}
