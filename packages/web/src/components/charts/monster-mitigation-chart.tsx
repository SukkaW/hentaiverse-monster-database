import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';
import type { MonsterDatabase } from '../../types';

import * as echarts from 'echarts/core';
import {
  DatasetComponent,
  GridComponent
} from 'echarts/components';
import {
  ScatterChart,
  BarChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { useMemo } from 'react';

echarts.use(
  [DatasetComponent, GridComponent, ScatterChart, BarChart, CanvasRenderer]
);

const COLOR_MAP = {
  fire: 'rgb(255, 104, 0)',
  cold: 'rgb(32, 145, 255)',
  wind: 'rgb(26, 188, 156)',
  elec: 'rgb(255, 204, 51)',
  dark: 'rgb(155, 89, 182)',
  holy: 'rgb(250, 249, 143)'
} as const;

export default function MonsterMitigationChart(prop: { type: MonsterDatabase.Element }) {
  const { monsters, isLoading } = useMonsterData();

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    const buildDataBin = (type: MonsterDatabase.Element) => {
      if (monsters) {
        const dataSet = monsters.map(monster => [monster.plvl, monster[type]]);
        const dataBin: number[] = [];

        for (let i = -50; i + 5 <= 75; i = i + 5) {
          dataBin.push(monsters.filter(monster => (monster[type] >= i && i + 5 > monster[type])).length);
        }

        return [dataSet, dataBin] as const;
      }

      return [null, null];
    };

    const arr = [];
    for (let i = -50; i + 5 <= 75; i = i + 5) {
      arr.push(i);
    }
    const [dataSet, dataBin] = buildDataBin(prop.type);

    return (
      <ReactEchart option={{
        title: {
          text: `Monster PL x ${prop.type} mitigation`,
          left: 'center',
          top: 0
        },
        grid: [{
          right: '52%',
          top: '10%'
        }, {
          left: '55%',
          top: '10%'
        }],
        xAxis: [{
          name: 'PL',
          max: 2250,
          min: 'dataMin',
          gridIndex: 0
        }, {
          name: 'amount',
          gridIndex: 1,
          max: 'dataMax'
        }],
        yAxis: [{
          name: 'mitigation',
          max: 75,
          min: -50,
          gridIndex: 0
        }, {
          type: 'category',
          data: arr,
          scale: true,
          gridIndex: 1,
          axisTick: { show: false },
          axisLabel: { show: false },
          axisLine: { show: false }
        }],
        series: [{
          type: 'scatter',
          symbolSize: 5,
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: dataSet,
          animationDelay: () => Math.random() * 200,
          color: COLOR_MAP[prop.type]
        }, {
          type: 'bar',
          barWidth: '99.3%',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: dataBin,
          animationDelay: () => Math.random() * 200,
          color: COLOR_MAP[prop.type]
        }]
      }} />
    );
  }, [isLoading, monsters, prop.type]);
}
