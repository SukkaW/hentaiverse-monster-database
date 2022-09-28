import { useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';

export function ReactEchart(props: { option: ECBasicOption }) {
  const echartInstanceRef = useRef<echarts.ECharts>();
  const { option } = props;

  const echarCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      // element is mounted
      echartInstanceRef.current = echarts.init(el);
    }
    if (!el) {
      // element is unmounted
      echartInstanceRef.current?.dispose();
      echartInstanceRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    echartInstanceRef.current?.setOption(option, { lazyUpdate: true });
  }, [option]);

  return <div className="h-full w-full" ref={echarCallbackRef} />;
}
