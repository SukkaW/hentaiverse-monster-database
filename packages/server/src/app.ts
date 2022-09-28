import type { FastifySchema, FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import { getMonsterDatabaseCompatibleDate, putMonsterDataToDatabase, validateMonsterDataInterface } from './util';

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

const schema: FastifySchema = {
  response: {
    405: {
      code: 'number'
    }
  }
};

const ALLOWED_REFERERS = [
  'hentaiverse.org',
  'alt.hentaiverse.org'
];

export const app: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCors, {
    origin: ALLOWED_REFERERS,
    methods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
    maxAge: 7200 // A 7200 seconds limit is defeined by WHATWG Fetch Standard.
  });

  fastify.all(
    '/monsterdata',
    { schema },
    async (request, response) => {
      if (request.method !== 'PUT') {
        response.status(405);
        return {
          code: 405,
          message: `${request.method ?? 'Non PUT'} method is not allowed`
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
      } catch { /* */ }

      // we simply swallow error (if any) and always return 200
      return {
        code: 200,
        message: 'monster data submitted'
      };
    }
  );
};
