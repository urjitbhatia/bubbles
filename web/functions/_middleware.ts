/**
 * Cloudflare Pages Functions middleware
 * Proxies /api/* requests to the backend Worker via Service Binding
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Proxy API requests to backend Worker
  if (url.pathname.startsWith('/api/')) {
    return env.API.fetch(request);
  }

  // Continue to static assets or other handlers
  return context.next();
};
