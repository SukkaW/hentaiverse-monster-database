import type { MonsterInfo } from '@hvmonsterdb/types';

const VALID_MONSTER_CLASS = new Set(['Arthropod', 'Avion', 'Beast', 'Celestial', 'Daimon', 'Dragonkin', 'Elemental', 'Giant', 'Humanoid', 'Mechanoid', 'Reptilian', 'Sprite', 'Undead', 'Common', 'Rare', 'Legendary', 'Ultimate']);

const VALID_MONSTER_ATTACK = new Set(['Piercing', 'Crushing', 'Slashing', 'Fire', 'Cold', 'Wind', 'Elec', 'Holy', 'Dark', 'Void']);

const MONSTER_STATUS = ['piercing', 'crushing', 'slashing', 'cold', 'wind', 'elec', 'fire', 'dark', 'holy'] as const;

export function validateMonsterDataInterface(data?: MonsterInfo): data is MonsterInfo {
  if (
    data
    && typeof data === 'object'
    && ([data.monsterId, data.plvl, data.piercing, data.crushing, data.slashing, data.cold, data.wind, data.elec, data.fire, data.dark, data.holy].every(Number.isInteger))
    && typeof data.monsterClass === 'string'
    && VALID_MONSTER_CLASS.has(data.monsterClass)
    && typeof data.monsterName === 'string'
    && typeof data.attack === 'string'
    && VALID_MONSTER_ATTACK.has(data.attack)
    && typeof data.trainer === 'string'
  ) {
    return true;
  }

  return false;
}

const padNumber = (num: number) => num.toString().padStart(2, '0');
export function getMonsterDatabaseCompatibleDate() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${padNumber(date.getUTCMonth() + 1)}-${padNumber(date.getUTCDate())}`;
}

const validMonsterStatus = (prevMonsterData: MonsterInfo, newMonsterData: MonsterInfo) => {
  if (
    prevMonsterData.monsterId === newMonsterData.monsterId
    && prevMonsterData.monsterClass === newMonsterData.monsterClass
    && prevMonsterData.plvl <= newMonsterData.plvl
    && prevMonsterData.attack === newMonsterData.attack
    && MONSTER_STATUS.every(
      key => prevMonsterData[key] <= newMonsterData[key]
    )
  ) {
    return true;
  }

  return false;
};

// You can replace "./adapter/deta" with your own adapter, as long
// as it exports two methods: getMonsterUsingId and updateMonster.
import { getMonsterUsingId, updateMonster } from './adapter/supbase';

export async function putMonsterDataToDatabase(data: MonsterInfo) {
  const existedMonster = await getMonsterUsingId(data.monsterId, data.trainer === 'Isekai');
  if (existedMonster && !validMonsterStatus(existedMonster, data)) {
    return;
  }
  return updateMonster(data, data.trainer === 'Isekai');
}
