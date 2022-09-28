import { useMonsterData } from '../../hooks/use-monster-data';

import type { MonsterInfo } from '@hvmonsterdb/types';

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
  [TitleComponent, TooltipComponent, BarChart, GridComponent, CanvasRenderer]
);

const processMonsterData = (monsters?: MonsterInfo[]): { name: string, value: number }[] => {
  if (!monsters) return [];

  const data: Record<string, number> = {};

  monsters.forEach(monster => {
    data[monster.attack] = (data[monster.attack] || 0) + 1;
  });

  return Object.keys(data).map(k => ({ name: k, value: data[k] }));
};

const useProcessedMonsterData = () => {
  const { monsters, isLoading } = useMonsterData();
  return {
    isLoading,
    dataSet: useMemo(() => processMonsterData(monsters), [monsters])
  };
};

export default function MonsterAttackBarChart() {
  const { dataSet, isLoading } = useProcessedMonsterData();

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={
        {
          title: {
            text: 'Monster Attack',
            left: 'center',
            top: 20
          },
          tooltip: {
            trigger: 'item',
            formatter: '<b>{b}</b> {c}'
          },
          xAxis: {
            type: 'category',
            data: dataSet.map(({ name }) => name),
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            show: false,
            type: 'value'
          },
          grid: {
            left: 80
          },
          series: [{
            type: 'bar',
            data: dataSet.map(({ value }) => value),
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.4)'
              }
            },
            label: {
              position: 'top',
              show: true
            },
            animationDelay: () => Math.random() * 200
          }]
        }
      } />
    );
  }, [dataSet, isLoading]);
}
