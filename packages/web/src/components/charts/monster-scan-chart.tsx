import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';

import type { MonsterInfo } from '@hvmonsterdb/types';

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

export default function MonsterScanChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataSet = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart
        option={{
          title: {
            text: 'Monster Update Time Distribution',
            left: 'center',
            top: 20
          },
          tooltip: {
            trigger: 'item'
          // formatter: '<b>{b}</b><br>{d}% <small>({c})</small>'
          },
          xAxis: {
            data: dataSet.date
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            type: 'bar',
            data: dataSet.value,
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.4)'
              }
            },
            animationDelay: () => Math.random() * 200
          }]
        }}
      />
    );
  }, [dataSet, isLoading]);
}

function buildDataSet(monsters?: MonsterInfo[]): { date: string[], value: number[] } {
  const unsortedDataSet: Record<string, number> = {};

  monsters?.forEach((monster) => {
    const date = new Date(monster.lastUpdate);
    const kDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    unsortedDataSet[kDate] = (unsortedDataSet[kDate] || 0) + 1;
  });

  const sortedDataSet = Object.keys(unsortedDataSet)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .reduce((obj: Record<string, number>, key) => {
      obj[key] = unsortedDataSet[key];
      return obj;
    }, {});

  const date: string[] = Object.keys(sortedDataSet);
  const value: number[] = Object.values(sortedDataSet);

  return { date, value };
}
