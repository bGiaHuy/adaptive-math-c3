import { DurableObject } from 'cloudflare:workers';
import { route, containerEnvironment } from './routing.mjs';
import { STRICT_AUTH_LIMITS } from './security.mjs';

export class EdgeRateGuard extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS rate_window (id INTEGER PRIMARY KEY, window_id INTEGER NOT NULL, count INTEGER NOT NULL)',
    );
  }

  async limit({ group }) {
    const maximum = STRICT_AUTH_LIMITS[group];
    if (!maximum) throw Error('Unsupported authentication edge group.');
    const window = Math.floor(Date.now() / 60000);
    const [counter] = this.ctx.storage.sql
      .exec(
        'INSERT INTO rate_window (id,window_id,count) VALUES (1,?,1) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN window_id=excluded.window_id THEN MIN(count+1,?) ELSE 1 END, window_id=excluded.window_id RETURNING count',
        window,
        maximum + 1,
      )
      .toArray();
    await this.ctx.storage.setAlarm((window + 2) * 60000);
    return { success: counter.count <= maximum };
  }

  alarm() {
    this.ctx.storage.sql.exec('DELETE FROM rate_window');
  }
}

export class AdaptiveMathApi extends DurableObject {
  starting;

  async ready() {
    const container = this.ctx.container;
    if (!container.running) {
      container.start({
        image: container.images.base,
        instance: 'basic',
        enableInternet: true,
        env: containerEnvironment(this.env),
      });
    }
    await container.setInactivityTimeout(30 * 60 * 1000);
    const port = container.getTcpPort(4000);
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const response = await port.fetch('http://container/api/v1/health', {
          signal: AbortSignal.timeout(1000),
        });
        await response.body?.cancel();
        if (response.ok) return;
      } catch {
        /* Retry readiness only. Never retry an application mutation. */
      }
      await scheduler.wait(200);
    }
    throw Error('API did not pass readiness.');
  }

  async fetch(request) {
    this.starting ??= this.ready().finally(() => {
      this.starting = undefined;
    });
    await this.starting;
    const url = new URL(request.url);
    url.protocol = 'http:';
    url.host = 'container';
    const forwarded = new Request(url, request);
    forwarded.headers.delete('host');
    // No body buffering, cookie rewriting, redirects or mutation retries.
    return this.ctx.container.getTcpPort(4000).fetch(forwarded);
  }
}

export default { fetch: route };
