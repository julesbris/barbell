// Progress-photo store backed by Netlify Blobs.
// Endpoints (same origin as the app):
//   GET    /.netlify/functions/photos          -> [{week,date,data}, ...]
//   POST   /.netlify/functions/photos {week,date,data}
//   DELETE /.netlify/functions/photos?week=N
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("progress-photos");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const out = [];
    for (const b of blobs) {
      const rec = await store.get(b.key, { type: "json" });
      if (rec) out.push({ week: Number(b.key), date: rec.date, data: rec.data });
    }
    return Response.json(out);
  }

  if (req.method === "POST") {
    const body = await req.json();
    if (body.week == null) return new Response("week required", { status: 400 });
    await store.setJSON(String(body.week), { date: body.date, data: body.data });
    return Response.json({ ok: true, week: body.week });
  }

  if (req.method === "DELETE") {
    const week = url.searchParams.get("week");
    if (week) await store.delete(String(week));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/.netlify/functions/photos" };
