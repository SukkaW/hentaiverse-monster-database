import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '@hvmonsterdb/server/src/app';
import Fastify from 'fastify';
import * as dotenv from 'dotenv';

if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
  dotenv.config();
}

const fastify = Fastify({});
fastify.register(app);

export default async (request: VercelRequest, response: VercelResponse) => {
  await fastify.ready();
  fastify.server.emit('request', request, response);
};
