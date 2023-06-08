import { Grid } from 'gridjs';
import { useMonsterData } from '../hooks/use-monster-data';
import type { MonsterInfo } from '@hvmonsterdb/types';

import 'gridjs/dist/theme/mermaid.css';
import '../css/overwrite-gridjs.css';
import { useEffect, useMemo, useRef } from 'react';
import { useTrainer } from './search-by-trainer-state';

type DataTablesTColumn = Tuple<{
  name: string,
  id: keyof MonsterInfo
  sort?: boolean,
  width?: string
}, 16>;

const columns: DataTablesTColumn = [
  {
    id: 'monsterId',
    name: 'ID',
    width: '60px'
  }, {
    id: 'monsterClass',
    name: 'Class',
    width: '80px'
  }, {
    id: 'monsterName',
    name: 'Name',
    width: '240px'
  }, {
    id: 'plvl',
    name: 'PL',
    width: '40px'
  }, {
    id: 'trainer',
    name: 'trainer',
    width: '240px'
  }, {
    id: 'attack',
    name: 'attack',
    width: '70px'
  }, {
    id: 'piercing',
    name: 'Pierce',
    width: '80px'
  }, {
    id: 'crushing',
    name: 'Crush',
    width: '80px'
  }, {
    id: 'slashing',
    name: 'Slash',
    width: '80px'
  }, {
    id: 'fire',
    name: 'fire',
    width: '50px'
  }, {
    id: 'cold',
    name: 'cold',
    width: '50px'
  }, {
    id: 'wind',
    name: 'wind',
    width: '50px'
  }, {
    id: 'elec',
    name: 'elec',
    width: '50px'
  }, {
    id: 'dark',
    name: 'dark',
    width: '50px'
  }, {
    id: 'holy',
    name: 'holy',
    width: '50px'
  }, {
    id: 'lastUpdate',
    name: 'Last Update',
    width: '165px'
  }
];

export function MonsterDataTable() {
  const { monsters: rawMonsterDatas, isLoading } = useMonsterData();
  const elementRef = useRef<HTMLDivElement>(null);
  const trainerName = useTrainer();

  const data = useMemo<Tuple<string | number, 16>[]>(() => {
    if (rawMonsterDatas) {
      const result: Tuple<string | number, 16>[] = [];

      (trainerName ? rawMonsterDatas?.filter(m => m.trainer.toLowerCase() === trainerName?.toLowerCase()) : rawMonsterDatas)?.forEach(monsterInfo => {
        const row = new Array(16);
        columns.forEach((key, index) => {
          row[index] = monsterInfo[key.id];
        });
        result.push(row as Tuple<string | number, 16>);
      });

      return result;
    }

    return [];
  }, [rawMonsterDatas, trainerName]);

  const gridjsOption = useMemo(() => ({
    columns,
    data,
    search: true,
    sort: true,
    pagination: {
      enabled: true,
      limit: 20
    }
  }), [data]);

  const isFirstRenderRef = useRef(true);
  const gridInstance = useRef<Grid>();

  useEffect(() => {
    if (!isLoading) {
      if (!gridInstance.current) {
        gridInstance.current = new Grid(gridjsOption);
      }

      if (elementRef.current) {
        if (isFirstRenderRef.current) {
          isFirstRenderRef.current = false;
          gridInstance.current.render(elementRef.current);
        } else {
          gridInstance.current.updateConfig(gridjsOption).forceRender();
        }
      }
    }
  }, [isLoading, gridjsOption]);

  if (isLoading) {
    return <div className="mt-12 text-lg text-center">Loading...</div>;
  }

  return (
    <div className="text-sm" ref={elementRef} />
  );
}
