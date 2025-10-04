// Migrate the old data to the new server
import { Deta } from 'deta';
import path from 'node:path';
import { promises as fsPromises } from 'node:fs';
import process from 'node:process';
import progress from 'cli-progress';

import dotenv from 'dotenv';
import findUp from 'find-up';

import { chunk } from 'foxts/chunk';

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

  const [persistentData, isekaiData] = await Promise.all([
    fsPromises.readFile(path.resolve(__dirname, 'persistent.json'), 'utf8').then(JSON.parse),
    fsPromises.readFile(path.resolve(__dirname, 'isekai.json'), 'utf8').then(JSON.parse)
  ]);

  if (Array.isArray(persistentData)) {
    const bar = new progress.SingleBar({}, progress.Presets.legacy);
    bar.start(100, 0, {
      speed: 'N/A'
    });

    await Promise.all(
      chunk(persistentData, 500).map(async (chunk) => {
        await persistentWorldDB.putMany(chunk.map(data => ({
          ...data,
          key: String(data.monsterId)
        })));
        bar.increment(0.2);
      })
    );
    bar.stop();
  }
  console.log('Persistent Monster Data Imorted!');

  if (Array.isArray(isekaiData)) {
    const bar = new progress.SingleBar({}, progress.Presets.legacy);
    bar.start(100, 0, {
      speed: 'N/A'
    });

    for (const c of chunk(isekaiData, 500)) {
      // eslint-disable-next-line no-await-in-loop -- no concurrency
      await isekaiWorldDB.putMany(c.map((data) => ({
        ...data,
        key: String(data.monsterId)
      })));
      bar.increment(0.1);
    }

    bar.stop();
  }

  console.log('Isekai Monster Data Imorted!');
})();
