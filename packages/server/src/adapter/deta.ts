import { Deta } from 'deta';
import type { MonsterInfo } from '@hvmonsterdb/types';
import type { GetMonsterUsingId, UpdateMonster } from './type';

const project = Deta(process.env.DETA_PROJECT_KEY);

export const getMonsterUsingId: GetMonsterUsingId = (monsterId: number, isIsekai: boolean) => {
  const db = project.Base(isIsekai ? 'isekai' : 'persistent');
  return db.get(String(monsterId)) as unknown as Promise<MonsterInfo>;
};

export const updateMonster: UpdateMonster = (data: MonsterInfo, isIsekai: boolean) => {
  const db = project.Base(isIsekai ? 'isekai' : 'persistent');
  return db.put(data as any, String(data.monsterId));
};
