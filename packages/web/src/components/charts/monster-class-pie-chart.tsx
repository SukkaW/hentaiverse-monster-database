import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import {
  PieChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { buildDataSet } from './monster-class-bar-chart';
import { useMemo } from 'react';

echarts.use(
  [TitleComponent, TooltipComponent, PieChart, CanvasRenderer]
);

export default function MonsterClassPieChart() {
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
            text: 'Monster Class Distribution',
            left: 'center',
            top: 20
          },
          tooltip: {
            trigger: 'item',
            formatter: '<b>{b}</b><br>{d}% <small>({c})</small>'
          },
          series: [{
            name: 'monsterClass',
            type: 'pie',
            radius: '50%',
            data: dataSet.sort((a, b) => a.value - b.value),
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
