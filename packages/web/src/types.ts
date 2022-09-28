export namespace MonsterDatabase {
  export interface MonsterInfo {
    monsterId: number
    monsterClass: string
    monsterName: string
    /**
     * @description - PL
     */
    plvl: number
    /**
     * @description - Attack Mode
     */
    attack: string

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
     * @description - Last time update (can be parsed through Date)
     */
    lastUpdate: string
  }

  export type ApiResponse = MonsterInfo[];

  export type Element = 'fire' | 'cold' | 'wind' | 'elec' | 'dark' | 'holy';
}
