import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '@hvmonsterdb/server/src/app';
import Fastify from 'fastify';

const fastify = Fastify({});
fastify.register(app);

export default (request: VercelRequest, response: VercelResponse) => {
  // eslint-disable-next-line promise/catch-or-return -- not catchable
  fastify.ready().then(() => fastify.server.emit('request', request, response));
};
