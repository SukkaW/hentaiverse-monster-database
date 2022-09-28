import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  GridComponent,
  TooltipComponent
} from 'echarts/components';
import {
  BarChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import type { MonsterDatabase } from '../../types';
import { useMemo } from 'react';

echarts.use(
  [TitleComponent, GridComponent, TooltipComponent, BarChart, CanvasRenderer]
);

export default function MonsterPLHistogramChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataBin = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={{
        title: {
          text: 'Monster PL Histogram',
          left: 'center',
          top: 0
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          scale: true,
          name: 'PL',
          max: 2250
        },
        yAxis: {
          type: 'value',
          name: 'amount'
        },
        tooltip: {
          trigger: 'item',
          formatter: ({ data }: { data: (number | string)[] }) => `<b>${data[4]}</b> ${data[1]}`
        },
        series: [{
          name: 'monsterClass',
          type: 'bar',
          barWidth: '99.5%',
          data: dataBin,
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.4)'
            }
          },
          animationDelay: () => Math.random() * 200
        }]
      }} />
    );
  }, [dataBin, isLoading]);
}

function buildDataSet(monsters?: MonsterDatabase.MonsterInfo[]) {
  if (!monsters) return [];

  const plArr = monsters.filter(monster => monster.plvl > 0).map(monster => monster.plvl) ?? [];

  const dataBin: [number, number, number, number, string][] = [];

  for (let i = 0; i + 50 <= 2250; i = i + 50) {
    dataBin.push([i + 25, plArr.filter((plvl) => (plvl > i && i + 50 >= plvl)).length, i, i + 50, `${i} - ${i + 50}`]);
  }

  return dataBin;
}
