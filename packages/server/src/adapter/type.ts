import type { MonsterInfo } from '@hvmonsterdb/types';
export type GetMonsterUsingId = (monsterId: number, isIsekai: boolean) => Promise<MonsterInfo>;
export type UpdateMonster = (data: MonsterInfo, isIsekai: boolean) => Promise<unknown>;
