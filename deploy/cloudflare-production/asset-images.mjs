export async function assetImage(request, env, ctx, cacheOverride) {
  const url = new URL(request.url);
  if (
    env.IMAGE_OPTIMIZATION_ENABLED !== 'true' ||
    !env.IMAGES ||
    !['GET', 'HEAD'].includes(request.method) ||
    !/^\/(images|math-import-assets)\/[A-Za-z0-9_./-]+\.png$/.test(url.pathname)
  )
    return null;
  const accepts = (request.headers.get('accept') || '').split(',').some((part) => {
    const [type, ...options] = part.trim().split(';');
    const quality = options.find((item) => item.trim().startsWith('q='));
    return type.toLowerCase() === 'image/webp' && (!quality || Number(quality.trim().slice(2)) > 0);
  });
  if (!accepts) return null;
  const cache = cacheOverride || caches.default;
  const sourceUrl = new URL(url.pathname, url.origin);
  const keyUrl = new URL(sourceUrl);
  keyUrl.searchParams.set('__image', 'webp-lossless-v1');
  keyUrl.searchParams.set('__version', env.CF_VERSION_METADATA?.id || 'local');
  const key = new Request(keyUrl);
  const cached = await cache.match(key);
  if (cached) return new Response(request.method === 'HEAD' ? null : cached.body, cached);
  const source = await env.ASSETS.fetch(
    new Request(sourceUrl, { headers: { accept: 'image/png' } }),
  );
  if (source.status !== 200 || !source.headers.get('content-type')?.startsWith('image/png'))
    return null;
  const bytes = await source.arrayBuffer();
  if (bytes.byteLength > 20 * 1024 * 1024)
    return new Response(request.method === 'HEAD' ? null : bytes, source);
  let body = bytes,
    type = 'image/png',
    mode = 'original';
  try {
    // Cloudflare documents quality=100 as lossless WebP. No crop/resize/color operation.
    const transformed = await env.IMAGES.input(new Response(bytes).body).output({
      format: 'image/webp',
      quality: 100,
    });
    const optimized = await transformed.response().arrayBuffer();
    if (optimized.byteLength < bytes.byteLength) {
      body = optimized;
      type = 'image/webp';
      mode = 'lossless-webp';
    }
  } catch {
    console.info(JSON.stringify({ event: 'image_transform_fallback' }));
  }
  const headers = new Headers(source.headers);
  headers.set('content-type', type);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('cache-control', 'public, max-age=86400');
  headers.append('vary', 'Accept');
  headers.set('x-image-optimization', mode);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', body));
  headers.set(
    'etag',
    '"' + [...hash].map((value) => value.toString(16).padStart(2, '0')).join('') + '"',
  );
  const response = new Response(body, { headers });
  ctx.waitUntil(cache.put(key, response.clone()).catch(() => {}));
  return request.method === 'HEAD' ? new Response(null, { headers }) : response;
}
