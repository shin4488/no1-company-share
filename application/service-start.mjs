import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

// Nitro does not load .env in production. Preserve the existing VPS settings.
if (existsSync('.env')) {
  loadEnvFile('.env');
}
process.env.PORT ||= process.env.NUXT_PORT || '3000';

await import('./.output/server/index.mjs');
