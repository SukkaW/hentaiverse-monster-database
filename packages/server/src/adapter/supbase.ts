import { createClient } from '@supabase/supabase-js';
import type { MonsterInfo } from '@hvmonsterdb/types';
import type { GetMonsterUsingId, UpdateMonster } from './type';
import process from 'node:process';

if (
  typeof process.env.SUPABASE_PROJECT_URL !== 'string'
  || typeof process.env.SUPABASE_SERVICE_KEY !== 'string'
) {
  throw new TypeError('SUPABASE_PROJECT_URL or SUPABASE_SERVICE_KEY is not defined!');
}

const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_SERVICE_KEY);

export const getMonsterUsingId: GetMonsterUsingId = async (monsterId: number, isIsekai: boolean): Promise<MonsterInfo | null> => {
  const db = supabase.from(isIsekai ? 'Isekai' : 'Persistent');
  const { data, error } = await db.select('*').eq('monsterId', monsterId).limit(1).single();
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }
  return data;
};

export const updateMonster: UpdateMonster = async (data: MonsterInfo, isIsekai: boolean) => {
  const db = supabase.from(isIsekai ? 'Isekai' : 'Persistent');

  const { error } = await db.upsert(
    data,
    {
      onConflict: ['monsterId'].join(',')
    }
  );

  if (error) {
    console.error(error);
  }
};
