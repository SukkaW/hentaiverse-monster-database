export type MonsterClass = 'Arthropod' | 'Avion' | 'Beast' | 'Celestial' | 'Daimon' | 'Dragonkin' | 'Elemental' | 'Giant' | 'Humanoid' | 'Mechanoid' | 'Reptilian' | 'Sprite' | 'Undead' | 'Common' | 'Rare' | 'Legendary' | 'Ultimate';
export type MonsterAttack = 'Piercing' | 'Crushing' | 'Slashing' | 'Fire' | 'Cold' | 'Wind' | 'Elec' | 'Holy' | 'Dark' | 'Void';

export interface MonsterInfo {
  monsterId: number
  monsterClass: MonsterClass
  monsterName: string
  /**
   * @description PL
   */
  plvl: number
  /**
   * @description Attack Mode
   */
  attack: MonsterAttack

  trainer: string
  piercing: number
  crushing: number
  slashing: number
  cold: number
  wind: number
  elec: number
  fire: number
  dark: number
  holy: number

  /**
   * @description Last time update (can be parsed through Date)
   */
  lastUpdate: string
}
