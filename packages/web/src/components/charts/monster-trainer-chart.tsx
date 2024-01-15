import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';

import type { MonsterInfo } from '@hvmonsterdb/types';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import {
  ScatterChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { useMemo } from 'react';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, ScatterChart, CanvasRenderer]
);

export default function MonsterTrainerChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataSet = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={{
        title: {
          text: 'Trainer Monster Amount Toplist',
          left: 'center',
          top: 0
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
            rotate: 30
          }
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 20
        }, {
          show: true,
          type: 'slider',
          top: '90%',
          xAxisIndex: [0],
          start: 0,
          end: 20
        }],
        grid: {
          left: 100,
          right: 100,
          bottom: 150
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
      }} />
    );
  }, [dataSet, isLoading]);
}

function buildDataSet(monsters?: MonsterInfo[]): Array<{ name: string, value: number }> {
  if (!monsters) {
    return [];
  }

  const unsortedDataSet: Record<string, number> = {};

  monsters.filter(monster => monster.trainer !== '').forEach(monster => {
    unsortedDataSet[monster.trainer] = (unsortedDataSet[monster.trainer] || 0) + 1;
  });

  return Object.entries(unsortedDataSet).sort(([, a], [, b]) => b - a).map(([name, value]) => ({ name, value }));
}
