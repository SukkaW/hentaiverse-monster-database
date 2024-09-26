import process from 'node:process';

import * as dotenv from 'dotenv';
import findUp from 'find-up';
import Fastify from 'fastify';

import { app } from './app';

/**
 * This is an example of how you would normally start your own server.
 */

if (typeof process.env.SUPABASE_PROJECT_URL !== 'string') {
  dotenv.config({ path: findUp.sync('.env') });
}

if (
  typeof process.env.SUPABASE_PROJECT_URL !== 'string'
  || typeof process.env.SUPABASE_SERVICE_KEY !== 'string'
) {
  throw new TypeError('SUPABASE_PROJECT_URL or SUPABASE_SERVICE_KEY is not defined!');
}

let port = 3010;
if (process.env.POST != null) {
  const envPort = Number.parseInt(process.env.POST, 10);
  if (!Number.isNaN(envPort)) {
    port = envPort;
  }
}

const fastify = Fastify({
  logger: true
});

fastify.register(app);
fastify.listen({ port });

export {};
