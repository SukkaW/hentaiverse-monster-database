import type { MonsterInfo } from '@hvmonsterdb/types';

const excludedMonsterClass = new Set(['Rare', 'Legendary', 'Ultimate', 'Common']);

export function buildDataSet(monsters?: MonsterInfo[]): Array<{ name: string, value: number }> {
  if (!monsters) return [];

  const unsortedDataSet: Record<string, number> = {};

  monsters.forEach(monster => {
    if (!excludedMonsterClass.has(monster.monsterClass)) {
      unsortedDataSet[monster.monsterClass] = (unsortedDataSet[monster.monsterClass] || 0) + 1;
    }
  });

  const sortedDataSet = Object.keys(unsortedDataSet).sort().reduce((obj: Record<string, number>, key) => {
    obj[key] = unsortedDataSet[key];
    return obj;
  }, {});

  return Object.entries(sortedDataSet).map(([key, value]) => ({ name: key, value }));
}
