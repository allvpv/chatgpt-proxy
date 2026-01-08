const PROXY_PREFIX = "/new-blog";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Ensure path starts with the prefix
    if (!url.pathname.startsWith(PROXY_PREFIX)) {
      return new Response("Not Found", { status: 404 });
    }

    // Strip the prefix
    let strippedPath = url.pathname.slice(PROXY_PREFIX.length);

    // Normalize: ensure leading slash
    if (!strippedPath.startsWith("/")) {
      strippedPath = "/" + strippedPath;
    }

    // Construct target URL
    const targetUrl = new URL(
      `https://chatgpt.com/backend-api/codex${strippedPath}${url.search}`
    );

    const headers = new Headers(request.headers);
    headers.set("Host", "chatgpt.com");
    headers.set("Origin", "https://chatgpt.com");
    headers.set("Referer", "https://chatgpt.com/");

    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    const response = await fetch(proxiedRequest);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
