// Express accepts case-insensitive routes and an optional trailing slash.
// Compare the equivalent path at the edge, but forward the original Request.
export function requestPath(request) {
  return new URL(request.url).pathname.toLowerCase().replace(/\/+$/, '') || '/';
}
