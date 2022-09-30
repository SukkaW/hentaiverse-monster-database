import * as dotenv from 'dotenv';
import findUp from 'find-up';
import Fastify from 'fastify';

import { app } from './app';

/**
 * This is an example of how you would normally start your own server.
 */

if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
  dotenv.config({ path: findUp.sync('.env') });
}

let port = 3000;
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
