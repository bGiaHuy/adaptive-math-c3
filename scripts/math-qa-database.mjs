import net from 'node:net';
import { PGlite } from '@electric-sql/pglite';
import { fromNodeSocket } from 'pg-gateway/node';

// Test-only PostgreSQL protocol bridge. Bind only to loopback; one transaction
// owns the WASM backend until ReadyForQuery is idle. Names are isolated per socket.
export async function createMathQaDatabase(port) {
  const db = new PGlite(); await db.waitReady;
  let owner = null, sequence = 0;
  const waiting = [], sockets = new Set();
  const acquire = async id => {
    if (owner === id) return;
    if (owner !== null) await new Promise(resolve => waiting.push({ id, resolve }));
    else owner = id;
  };
  const release = id => {
    if (owner !== id) return;
    const next = waiting.shift(); owner = next?.id ?? null; next?.resolve();
  };
  const namespaced = (raw, id) => {
    let b = Buffer.from(raw), type = String.fromCharCode(b[0]);
    const insertName = offset => {
      const end = b.indexOf(0, offset);
      if (end === offset || end < 0) return end + 1;
      const prefix = Buffer.from(`qa${id}_`);
      b = Buffer.concat([b.subarray(0, offset), prefix, b.subarray(offset)]);
      b.writeUInt32BE(b.length - 1, 1);
      return end + prefix.length + 1;
    };
    if (type === 'P' || type === 'E') insertName(5);
    if (type === 'B') { const next = insertName(5); insertName(next); }
    if (type === 'D' || type === 'C') insertName(6);
    return b;
  };
  const idle = bytes => {
    const b = Buffer.from(bytes);
    for (let i = 0; i + 5 <= b.length;) {
      const length = b.readUInt32BE(i + 1);
      if (b[i] === 90) return b[i + 5] === 73;
      i += length + 1;
    }
    return false;
  };
  const server = net.createServer(async socket => {
    const id = ++sequence; sockets.add(socket);
    socket.on('error', () => {});
    socket.once('close', async () => {
      sockets.delete(socket);
      const index = waiting.findIndex(w => w.id === id); if (index >= 0) waiting.splice(index, 1);
      if (owner === id) { await db.exec('ROLLBACK').catch(() => {}); release(id); }
    });
    try {
      await fromNodeSocket(socket, { auth: { method: 'trust' }, serverVersion: '17.0',
        onMessage: async (raw, state) => {
          if (!state.isAuthenticated) return;
          if (raw[0] === 88) return;
          await acquire(id);
          const result = await db.execProtocolRaw(namespaced(raw, id));
          if (idle(result)) release(id);
          return result;
        }
      });
    } catch (e) { console.error('QA protocol:', e.message); socket.destroy(); release(id); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { db, async close() { for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); await db.close(); } };
}
