import type { MonsterInfo } from '@hvmonsterdb/types';

export namespace MonsterDatabase {
  export type ApiResponse = MonsterInfo[];

  export type Element = 'fire' | 'cold' | 'wind' | 'elec' | 'dark' | 'holy';
}
