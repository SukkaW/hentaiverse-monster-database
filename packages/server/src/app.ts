/**
 * This is the entry point of the application. Everything in fastify is a fastify plugin.
 * The reason behind the "plugin" approach is that we can:
 *
 * - Import from a self-host server
 * - Import from an instance on the serverless platform
 * - Import from a test environment
 *
 * More details see https://www.fastify.io/docs/latest/Reference/Encapsulation/
 */

import type { FastifySchema, FastifyPluginAsync } from 'fastify';
import type { FastifyCorsOptions } from '@fastify/cors';
import { fastifyCors } from '@fastify/cors';
import { getMonsterDatabaseCompatibleDate, putMonsterDataToDatabase, validateMonsterDataInterface } from './util';
import { S } from 'fluent-json-schema';

const sharedResponseSchema = S.object().prop('code', S.number()).prop('msg', S.string());

const schema: FastifySchema = {
  response: {
    405: sharedResponseSchema,
    200: sharedResponseSchema
  }
};

const ALLOWED_REFERERS = [
  'hentaiverse.org',
  'alt.hentaiverse.org'
];

const fastifyCorsOption: FastifyCorsOptions = {
  origin: ALLOWED_REFERERS.map(host => `https://${host}`),
  methods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
  maxAge: 7200 // A 7200 seconds limit is defeined by WHATWG Fetch Standard.
};

export const app: FastifyPluginAsync = (fastify) => {
  fastify.register(fastifyCors, fastifyCorsOption);

  fastify.all(
    '/api/monsterdata',
    { schema },
    async (request, response) => {
      if (request.method !== 'PUT') {
        response.status(405);
        return {
          code: 405,
          msg: `${request.method || 'Non PUT'} method is not allowed`
        };
      }

      try {
        if (request.headers.referer && ALLOWED_REFERERS.includes(new URL(request.headers.referer).hostname)) {
          const data = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;

          if (validateMonsterDataInterface(data)) {
            data.lastUpdate = getMonsterDatabaseCompatibleDate();
            await putMonsterDataToDatabase(data);
          }
        }
      } catch (e) {
        console.error(e);
      }

      // we simply swallow error (if any) and always return 200
      return {
        code: 200,
        msg: 'monster data submitted'
      };
    }
  );

  return Promise.resolve();
};
