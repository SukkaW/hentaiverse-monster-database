import { useMonsterData } from '../../hooks/use-monster-data';
import type { MonsterDatabase } from '../../types';
import { ReactEchart } from '../react-echart';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {
  BarChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { useMemo } from 'react';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
);

export default function MonsterClassBarChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataSet = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={{
        title: {
          text: 'Monster Class',
          left: 'center',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '<b>{b}</b> {c}'
        },
        yAxis: {
          type: 'category',
          data: dataSet.map(({ name }) => name).reverse()
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        grid: {
          left: 80
        },
        series: [{
          type: 'bar',
          data: dataSet.map(({ value }) => value).reverse(),
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.4)'
            }
          },
          label: {
            position: 'right',
            show: true
          },
          animationDelay: () => Math.random() * 200
        }]
      }} />
    );
  }, [dataSet, isLoading]);
}

export function buildDataSet(monsters?: MonsterDatabase.MonsterInfo[]): { name: string, value: number }[] {
  if (!monsters) return [];

  const unsortedDataSet: Record<string, number> = {};

  monsters.filter(monster => !['Rare', 'Legendary', 'Ultimate', 'Common'].includes(monster.monsterClass)).forEach(monster => {
    unsortedDataSet[monster.monsterClass] = (unsortedDataSet[monster.monsterClass] || 0) + 1;
  });

  const sortedDataSet = Object.keys(unsortedDataSet).sort().reduce((obj: Record<string, number>, key) => {
    obj[key] = unsortedDataSet[key];
    return obj;
  }, {});

  return Object.entries(sortedDataSet).map(([key, value]) => ({ name: key, value }));
}
