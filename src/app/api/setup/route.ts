import { NextResponse } from "next/server";
import { ensureSchema, getDbClient } from "@/lib/db-schema";

/**
 * GET /api/setup — manually trigger table creation.
 *
 * Note: tables are now auto-created lazily by every API route (see
 * @/lib/db-schema ensureSchema). This endpoint remains for compatibility /
 * explicit debugging, and just calls the same ensureSchema().
 */
export async function GET() {
  const details: string[] = [];
  const url = process.env.DATABASE_URL;

  if (!url || url === "undefined" || url === "null") {
    return NextResponse.json(
      {
        ok: false,
        error: `DATABASE_URL tidak valid: "${url}".`,
        details,
      },
      { status: 500 }
    );
  }

  try {
    await ensureSchema();
    details.push("✓ Tabel Rsvp & Guest siap (atau sudah ada)");

    const client = getDbClient();
    try {
      await client.execute("SELECT 1");
      details.push("✓ Koneksi database berhasil");
    } finally {
      try { await client.close(); } catch { /* ignore */ }
    }

    return NextResponse.json({
      ok: true,
      message: "Setup selesai! Tabel Rsvp & Guest siap dipakai.",
      dbUrl: url.replace(/:\/\/[^@]*/, "://***"),
      details,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: errMsg,
        dbUrl: url.replace(/:\/\/[^@]*/, "://***"),
        details,
      },
      { status: 500 }
    );
  }
}
