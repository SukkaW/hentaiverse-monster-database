/* eslint-disable no-await-in-loop -- no concurrency */
import { Deta } from 'deta';
import path from 'path';
import { promises as fsPromises } from 'fs';
import findUp from 'find-up';

import * as dotenv from 'dotenv';

// TODO
// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- migrate later
import pRetry, { type Options as PRetryOptions } from 'p-retry';

import type Base from 'deta/dist/types/base';

(async () => {
  if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
    dotenv.config({ path: findUp.sync('.env') });
  }

  if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
    throw new TypeError('DETA_PROJECT_KEY is not defined!');
  }

  const project = Deta(process.env.DETA_PROJECT_KEY);

  const persistentWorldDB = project.Base('persistent');
  const isekaiWorldDB = project.Base('isekai');

  const fetchSinceLast = (db: Base, last: string) => async () => db.fetch({}, { last });

  let res = await persistentWorldDB.fetch();
  let persistentMonsterData = res.items;
  let retryOpt: PRetryOptions = {
    retries: 114514,
    onFailedAttempt(e) {
      console.log('[Persistent]', `Attempt ${e.attemptNumber} failed. There are ${e.retriesLeft} retries left.`);
    }
  };
  while (res.last) {
    res = await pRetry(
      fetchSinceLast(persistentWorldDB, res.last),
      retryOpt
    );
    persistentMonsterData = persistentMonsterData.concat(res.items);

    console.log('[Persistent]', persistentMonsterData.length, 'fetched!');
  }

  res = await isekaiWorldDB.fetch();
  let isekaiMonsterData = res.items;
  retryOpt = {
    retries: 114514,
    onFailedAttempt(e) {
      console.log('[Isekai]', `Attempt ${e.attemptNumber} failed. There are ${e.retriesLeft} retries left.`);
    }
  };

  while (res.last) {
    res = await pRetry(fetchSinceLast(isekaiWorldDB, res.last), retryOpt);
    isekaiMonsterData = isekaiMonsterData.concat(res.items);
    console.log('[Isekai]', isekaiMonsterData.length, 'fetched!');
  }

  persistentMonsterData.forEach(i => {
    delete i.key;
  });
  isekaiMonsterData.forEach(i => {
    delete i.key;
  });

  const distDir = path.resolve(__dirname, '../public');

  try {
    await fsPromises.mkdir(distDir);
  } catch (e) {
    if ((e as any).code === 'EEXIST') {
      // do nothing
    } else {
      throw e;
    }
  }

  await Promise.all([
    fsPromises.writeFile(path.resolve(distDir, 'persistent.json'), JSON.stringify(persistentMonsterData)),
    fsPromises.writeFile(path.resolve(distDir, 'isekai.json'), JSON.stringify(isekaiMonsterData))
  ]);
})();
