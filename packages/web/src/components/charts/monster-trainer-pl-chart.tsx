import { useMonsterData } from '../../hooks/use-monster-data';
import { ReactEchart } from '../react-echart';
import type { MonsterDatabase } from '../../types';

import * as echarts from 'echarts/core';
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import {
  BoxplotChart,
  ScatterChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import { useMemo } from 'react';

echarts.use(
  [DatasetComponent, TitleComponent, TooltipComponent, GridComponent, BoxplotChart, ScatterChart, CanvasRenderer, DataZoomComponent]
);

export default function MonsterTrainerPLChart() {
  const { monsters, isLoading } = useMonsterData();
  const dataSet = useMemo(() => buildDataSet(monsters), [monsters]);

  return useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <ReactEchart option={{
        title: {
          text: 'Trainer Monster PL Toplist',
          left: 'center',
          top: 0
        },
        dataset: [{
          source: dataSet.trainerPls
        }, {
          transform: {
            type: 'boxplot',
            config: { itemNameFormatter: (params: { value: number }) => dataSet.trainerNames[params.value] }
          }
        }, {
          fromDatasetIndex: 1,
          fromTransformResult: 1
        }],
        tooltip: {
          trigger: 'item',
          formatter: ({ data }: { data: (number | string)[] }) => `<b>${data[0]}</b><br>Min ${data[1]}<br>Max ${data[5]}`,
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          name: 'Trainer',
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          name: 'PL',
          max: 2250,
          splitLine: {
            show: true
          }
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
          name: 'boxplot',
          type: 'boxplot',
          datasetIndex: 1
        }, {
          name: 'outlier',
          type: 'scatter',
          symbolSize: 6,
          datasetIndex: 2
        }]
      }} />
    );
  }, [dataSet, isLoading]);
}

function buildDataSet(monsters?: MonsterDatabase.MonsterInfo[]): {
  trainerNames: string[],
  trainerPls: number[][]
} {
  const trainerMonsterPlMap: Record<string, number[]> = {};
  const unsortedDataSet: Record<string, {
    plArr: number[],
    avg: number
  }> = {};

  monsters?.filter(monster => monster.trainer !== '').forEach(monster => {
    (trainerMonsterPlMap[monster.trainer] = trainerMonsterPlMap[monster.trainer] || []).push(monster.plvl);
  });

  Object.entries(trainerMonsterPlMap).forEach(([trainer, monsterPlArr]) => {
    unsortedDataSet[trainer] = {
      plArr: monsterPlArr,
      avg: monsterPlArr.reduce((p, c) => p + c, 0) / monsterPlArr.length
    };
  });

  const sortedDataSet = Object.entries(unsortedDataSet).sort(([, { avg: avg1 }], [, { avg: avg2 }]) => avg2 - avg1);

  const trainerNames = sortedDataSet.map(([name]) => name);
  const trainerPls = sortedDataSet.map(([, { plArr }]) => plArr);
  return { trainerNames, trainerPls };
}
