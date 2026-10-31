import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getDbClient } from "@/lib/db-schema";

/** GET /api/guests/lookup?code=xxx → { ok, name|null }. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") ?? "").trim().toLowerCase();
    if (!code) {
      return NextResponse.json({ ok: true, name: null });
    }
    await ensureSchema();
    const client = getDbClient();
    try {
      const result = await client.execute({
        sql: 'SELECT name FROM Guest WHERE code = ?',
        args: [code],
      });
      const name = result.rows.length > 0 ? String(result.rows[0].name) : null;
      return NextResponse.json({ ok: true, name });
    } finally {
      try { await client.close(); } catch { /* ignore */ }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
