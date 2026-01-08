/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Construct target URL
    const targetUrl = new URL(
      `https://chatgpt.com/backend-api/codex${url.pathname}${url.search}`
    );

    // Clone headers and optionally adjust them
    const headers = new Headers(request.headers);

    // IMPORTANT: set Host to the target domain
    headers.set("Host", "chatgpt.com");

    // Optional but often needed
    headers.set("Origin", "https://chatgpt.com");
    headers.set("Referer", "https://chatgpt.com/");

    // Create the proxied request
    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    // Fetch from upstream
    const response = await fetch(proxiedRequest);

    // Return response as-is
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
