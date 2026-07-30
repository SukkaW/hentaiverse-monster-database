import { useCallback, useRef } from 'react';
import { useEffect } from 'foxact/use-abortable-effect';
import * as echarts from 'echarts/core';
import type { ECBasicOption } from 'echarts/types/dist/shared';

export function ReactEchart(props: { option: ECBasicOption }) {
  const echartInstanceRef = useRef<echarts.ECharts>(null);
  const { option } = props;

  const echarCallbackRef = useCallback<React.RefCallback<HTMLDivElement>>((el) => {
    if (el) {
      // element is mounted
      echartInstanceRef.current = echarts.init(el);
    }
    if (!el) {
      // element is unmounted
      echartInstanceRef.current?.dispose();
      echartInstanceRef.current = null;
    }
  }, []);

  useEffect((signal) => {
    function resizeEchart() {
      echartInstanceRef.current?.resize();
    }
    window.addEventListener('resize', resizeEchart, { signal });
  }, []);

  useEffect(() => {
    echartInstanceRef.current?.setOption(option, { lazyUpdate: true });
  }, [option]);

  return <div className="h-full w-full" ref={echarCallbackRef} />;
}
