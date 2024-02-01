import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '@hvmonsterdb/server/src/app';
import Fastify from 'fastify';
// import * as dotenv from 'dotenv';

// if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
//   dotenv.config();
// }

const fastify = Fastify({});
fastify.register(app);

export default (request: VercelRequest, response: VercelResponse) => {
  fastify.ready().then(() => fastify.server.emit('request', request, response));
};
