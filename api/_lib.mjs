// Shared helpers for the hosted functions (Vercel). Files starting with "_" are not deployed as endpoints.
export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

export const query = req => new URL(req.url, "http://localhost").searchParams;
