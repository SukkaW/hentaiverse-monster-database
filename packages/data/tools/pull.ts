import process from 'node:process';
import fsp from 'node:fs/promises';
import path from 'node:path';
import findUp from 'find-up';

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
// TODO
// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- migrate later
import pRetry from 'p-retry';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- migrate later
import type { Options as PRetryOptions } from 'p-retry';

if (typeof process.env.SUPABASE_PROJECT_URL !== 'string') {
  dotenv.config({ path: findUp.sync('.env') });
}

if (
  typeof process.env.SUPABASE_PROJECT_URL !== 'string'
  || typeof process.env.SUPABASE_SERVICE_KEY !== 'string'
) {
  throw new TypeError('SUPABASE_PROJECT_URL or SUPABASE_SERVICE_KEY is not defined!');
}

const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_SERVICE_KEY);
const persistentWorldDB = supabase.from('Persistent');
const isekaiWorldDB = supabase.from('Isekai');

(async () => {
  // Create a single supabase client for interacting with your database

  const persistentMonsterData = await fetchAllRowsFrom(persistentWorldDB, 'Persistent');
  const isekaiMonsterData = await fetchAllRowsFrom(isekaiWorldDB, 'Isekai');

  const distDir = path.resolve(__dirname, '../public');

  await fsp.mkdir(distDir, { recursive: true });

  await Promise.all([
    fsp.writeFile(path.resolve(distDir, 'persistent.json'), arrayStringify(persistentMonsterData)),
    fsp.writeFile(path.resolve(distDir, 'isekai.json'), arrayStringify(isekaiMonsterData))
  ]);
})();

async function fetchAllRowsFrom<T = any>(table: typeof persistentWorldDB | typeof isekaiWorldDB, logTitle: string): Promise<T[]> {
  const retryOpt: PRetryOptions = {
    retries: 10,
    onFailedAttempt(e) {
      console.log(`[${logTitle}]`, `Attempt ${e.attemptNumber} failed. There are ${e.retriesLeft} retries left.`);
    }
  };

  let allData: T[] = [];
  let from = 0;
  const pageSize = 800; // Adjust the page size if necessary
  let data: T[];

  const fetchFrom = (from: number) => async () => {
    // Fetch a chunk of data
    const { data, error } = await table
      .select('*')
      .range(from, from + pageSize - 1);

    if (error) {
      throw error as any;
    }
    return data;
  };

  do {
    // eslint-disable-next-line no-await-in-loop -- one by one
    data = await pRetry(
      fetchFrom(from),
      retryOpt
    );

    // Add the fetched data to the result set
    allData = allData.concat(data);
    console.log(`[${logTitle}]`, allData.length, 'fetched!');

    from += pageSize;
  } while (data.length === pageSize); // Continue fetching if the last chunk was full

  return allData;
}

function arrayStringify<T extends object>(object: T[]) {
  object.sort((a, b) => {
    if (
      !('lastUpdate' in a)
      || typeof a.lastUpdate !== 'string'
      || !('lastUpdate' in b)
      || typeof b.lastUpdate !== 'string'
    ) {
      return 0;
    }

    const dateA = new Date(a.lastUpdate).getTime();
    const dateB = new Date(b.lastUpdate).getTime();

    // sort from newest to oldest
    return dateA - dateB;
  });

  let result = '[\n';

  for (let i = 0, len = object.length - 1; i < len; i++) {
    result += JSON.stringify(object[i]);

    if (i < len - 1) {
      result += ',\n';
    } else {
      result += '\n';
    }
  }

  result += ']\n';

  return result;
}
