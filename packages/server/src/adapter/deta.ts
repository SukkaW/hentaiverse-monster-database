import { Deta } from 'deta';
import type { MonsterInfo } from '@hvmonsterdb/types';
import type { GetMonsterUsingId, UpdateMonster } from './type';
import process from 'node:process';

const project = Deta(process.env.DETA_PROJECT_KEY);

export const getMonsterUsingId: GetMonsterUsingId = (monsterId: number, isIsekai: boolean): Promise<MonsterInfo> => {
  const db = project.Base(isIsekai ? 'isekai' : 'persistent');
  return db.get(String(monsterId)) as any;
};

export const updateMonster: UpdateMonster = (data: MonsterInfo, isIsekai: boolean) => {
  const db = project.Base(isIsekai ? 'isekai' : 'persistent');
  return db.put(data as any, String(data.monsterId));
};
