// Migrate the old data to the new server
import { Deta } from 'deta';
import path from 'path';
import { promises as fsPromises } from 'fs';
import progress from 'cli-progress';

import dotenv from 'dotenv';
import findUp from 'find-up';

(async () => {
  if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
    dotenv.config({ path: findUp.sync('.env') });
  }

  if (typeof process.env.DETA_PROJECT_KEY !== 'string') {
    throw new Error('DETA_PROJECT_KEY is not defined!');
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

    await Promise.all(persistentData.reduce((result, element, index) => {
      const chunk = index % 500;
      result[chunk] ??= [];
      result[chunk].push(element);
      return result;
    }, []).map(async (chunk: any[]) => {
      await persistentWorldDB.putMany(chunk.map(data => ({
        ...data,
        key: String(data.monsterId)
      })));
      bar.increment(0.2);
    }));
    bar.stop();
  }
  console.log('Persistent Monster Data Imorted!');

  if (Array.isArray(isekaiData)) {
    const bar = new progress.SingleBar({}, progress.Presets.legacy);
    bar.start(100, 0, {
      speed: 'N/A'
    });

    for (const chunk of isekaiData.reduce((result, element, index) => {
      const chunk = index % 1000;
      result[chunk] ??= [];
      result[chunk].push(element);
      return result;
    }, [])) {
      // eslint-disable-next-line no-await-in-loop
      await isekaiWorldDB.putMany(chunk.map((data: any) => ({
        ...data,
        key: String(data.monsterId)
      })));
      bar.increment(0.1);
    }

    bar.stop();
  }

  console.log('Isekai Monster Data Imorted!');
})();
