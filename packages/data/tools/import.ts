import { createClient } from '@supabase/supabase-js';
import process from 'node:process';
import fsp from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import findUp from 'find-up';

if (typeof process.env.SUPABASE_PROJECT_URL !== 'string') {
  dotenv.config({ path: findUp.sync('.env') });
}

(async () => {
  if (
    typeof process.env.SUPABASE_PROJECT_URL !== 'string'
    || typeof process.env.SUPABASE_SERVICE_KEY !== 'string'
  ) {
    throw new TypeError('SUPABASE_PROJECT_URL or SUPABASE_SERVICE_KEY is not defined!');
  }

  // Create a single supabase client for interacting with your database
  const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_SERVICE_KEY);
  const [persistentData, isekaiData] = await Promise.all([
    fsp.readFile(path.join(__dirname, 'persistent.json'), 'utf8').then(JSON.parse),
    fsp.readFile(path.join(__dirname, 'isekai.json'), 'utf8').then(JSON.parse)
  ]);

  console.log(persistentData, isekaiData);

  await supabase.from('Persistent').insert(persistentData);
  await supabase.from('Isekai').insert(isekaiData);
})();
