import { DurableObject } from 'cloudflare:workers';
import { routeRequest, containerRequest, runtimeEnvironment } from './router.mjs';

export class C3Api extends DurableObject {
  starting;

  async ready() {
    const container = this.ctx.container;
    if (!container.running) {
      container.start({
        image: container.images.base,
        instance: 'basic',
        enableInternet: true,
        env: runtimeEnvironment(this.env)
      });
    }
    await container.setInactivityTimeout(10 * 60 * 1000);
    const port = container.getTcpPort(8080);
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      try {
        const response = await port.fetch('http://container/api/v1/health', {
          signal: AbortSignal.timeout(2000)
        });
        const health = await response.json();
        if (response.ok && health.status === 'ok' && health.database === 'connected') return;
      } catch { /* Startup may precede the listening socket; no user request is retried. */ }
      await scheduler.wait(500);
    }
    throw new Error('C3 API readiness timed out');
  }

  async fetch(request) {
    this.starting ??= this.ready().finally(() => { this.starting = undefined; });
    try {
      await this.starting;
    } catch {
      return Response.json({ code: 'SERVICE_UNAVAILABLE', message: 'Máy chủ đang khởi động. Vui lòng thử lại.' }, {
        status: 503, headers: { 'cache-control': 'no-store' }
      });
    }
    return this.ctx.container.getTcpPort(8080).fetch(containerRequest(request));
  }
}

export default { fetch: routeRequest };
