import * as dotenv from 'dotenv';
import { getMonsterDatabaseCompatibleDate, putMonsterDataToDatabase, validateMonsterDataInterface } from '../src/util';

import type { VercelRequest, VercelResponse } from '@vercel/node';

if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
  dotenv.config();
}

export default async (request: VercelRequest, response: VercelResponse) => {
  // CORS
  if (request.headers.origin) {
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    // A 7200 seconds limit is defeined by WHATWG Fetch Standard.
    response.setHeader('Access-Control-Max-Age', '7200');
    const reqAllowedHeaders = request.headers['access-control-request-headers'];
    if (reqAllowedHeaders) {
      response.setHeader('Access-Control-Allow-Headers', reqAllowedHeaders);
    }
  }
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  // Limit access domain
  if (!request.headers.host?.endsWith('.skk.moe')) {
    response.status(403).json({
      code: 403,
      message: 'Access through non-skk.moe domain is not allowed'
    });
    return;
  }

  if (request.method !== 'PUT') {
    response.status(405).json({
      code: 405,
      message: `${request.method ?? 'Non PUT'} method is not allowed`
    });
    return;
  }

  try {
    if (request.headers.referer && new URL(request.headers.referer).hostname.includes('hentaiverse.org')) {
      const data = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;

      if (validateMonsterDataInterface(data)) {
        data.lastUpdate = getMonsterDatabaseCompatibleDate();
        await putMonsterDataToDatabase(data);
      }
    }
  } catch { /** empty */ }

  response.status(200).json({
    code: 200,
    message: 'monster data submitted'
  });
};
