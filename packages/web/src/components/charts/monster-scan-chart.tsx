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

    // Calculate date from one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDateStr = oneYearAgo.toISOString().split('T', 1)[0];

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
            data: dataSet.date,
            axisLabel: {
              interval: Math.max(0, Math.floor(dataSet.date.length / 20))
            }
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          dataZoom: [{
            type: 'inside',
            startValue: startDateStr,
            endValue: dataSet.date[dataSet.date.length - 1]
          }, {
            show: true,
            type: 'slider',
            top: '90%',
            xAxisIndex: [0],
            startValue: startDateStr,
            endValue: dataSet.date[dataSet.date.length - 1]
          }],
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
          }],
          grid: {
            left: 0,
            right: 0,
            containLabel: true
          }
        }}
      />
    );
  }, [dataSet, isLoading]);
}

function buildDataSet(monsters?: MonsterInfo[]): { date: string[], value: number[] } {
  if (!monsters?.length) {
    return { date: [], value: [] };
  }

  // Aggregate monsters by date (YYYY-MM-DD format)
  const dateCountMap = monsters.reduce<Record<string, number>>((acc, monster) => {
    const dateStr = new Date(monster.lastUpdate).toISOString().split('T', 1)[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  // Generate continuous date range filling in missing days with 0
  const sortedDates = Object.keys(dateCountMap).sort();
  const startDate = new Date(sortedDates[0]);
  const endDate = new Date(sortedDates[sortedDates.length - 1]);

  const result: Record<string, number> = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T', 1)[0];
    result[dateStr] = dateCountMap[dateStr] ?? 0;
  }

  const date = Object.keys(result);
  const value = Object.values(result);

  return { date, value };
}
