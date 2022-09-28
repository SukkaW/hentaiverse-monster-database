import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {
  ScatterChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { useMemo } from 'react';

import type { MonsterInfo } from '@hvmonsterdb/types';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, ScatterChart, CanvasRenderer]
);

export default function MonsterPLIdDotChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataSet = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={{
        title: {
          text: 'Monster PL - ID Scatter',
          left: 'center',
          top: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: (param: { data: number[] }) => `ID: ${param.data[0]}, PL: ${param.data[1]}`
        },
        xAxis: {
          name: 'ID',
          max: 'dataMax'
        },
        yAxis: {
          name: 'PL',
          max: 2250,
          min: 'dataMin'
        },
        series: [{
          type: 'scatter',
          symbolSize: 6,
          data: dataSet,
          animationDelay: () => Math.random() * 200
        }]
      }} />
    );
  }, [dataSet, isLoading]);
}

function buildDataSet(monsters?: MonsterInfo[]) {
  if (!monsters) return [];
  return monsters.filter(monster => monster.plvl > 0).map(monster => ([monster.monsterId, monster.plvl] as const));
}
