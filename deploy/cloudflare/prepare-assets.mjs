import { access, copyFile } from 'node:fs/promises';
await access(new URL('../../dist/index.html', import.meta.url));
await copyFile(new URL('./_headers', import.meta.url), new URL('../../dist/_headers', import.meta.url));
