const RESPONSE_HEADERS_TO_SKIP = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "set-cookie",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

export function forwardBackendResponse(backendResponse: Response): Response {
  const responseHeaders = new Headers();
  for (const [name, value] of backendResponse.headers) {
    if (!RESPONSE_HEADERS_TO_SKIP.has(name.toLowerCase())) {
      responseHeaders.append(name, value);
    }
  }
  responseHeaders.set("Cache-Control", "private, no-store");

  for (const cookie of backendResponse.headers.getSetCookie()) {
    responseHeaders.append(
      "Set-Cookie",
      cookie.replace(/;\s*domain=[^;]*/i, ""),
    );
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}
