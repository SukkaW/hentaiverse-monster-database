import useSWRImmutable from 'swr/immutable';
import { useIsIsekai } from '../components/isekai-state';
import type { MonsterDatabase } from '../types';

export function useMonsterData() {
  const isIsekai = useIsIsekai();

  const url = isIsekai ? 'https://hv-monsterdb-data.skk.moe/isekai.json' : 'https://hv-monsterdb-data.skk.moe/persistent.json';
  const { data, error } = useSWRImmutable<MonsterDatabase.ApiResponse>(
    url,
    (url) => fetch(url)
      .then(r => r.json())
      .then((data: MonsterDatabase.ApiResponse) => data
        .map((v, i) => ({ i, lastUpdate: new Date(v.lastUpdate).getTime() }))
        .filter(i => !Number.isNaN(i.lastUpdate))
        .sort((a, b) => b.lastUpdate - a.lastUpdate)
        .map(v => data[v.i])),
    { suspense: true }
  );

  return {
    monsters: data,
    isLoading: !error && !data,
    isError: error
  };
}
