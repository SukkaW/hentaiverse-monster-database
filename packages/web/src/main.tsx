import { MonsterDataTable } from './components/data-tables';
import { FilterByTrainerForm } from './components/filter-by-trainer-form';
import { IsekaiSwitch } from './components/isekai-switch';
import { Row, Col } from './components/row-col';
import { AntiAdBlock } from './components/anti-adblock';
import { Box, Tabs } from '@radix-ui/themes';

import { Suspense, lazy, useEffect } from 'react';
import { useIsIsekai } from './components/isekai-state';
import type { MonsterDatabase } from './types';
import { useSetTrainer } from './components/search-by-trainer-state';

const MonsterAttackBarChart = lazy(() => import('./components/charts/monster-attack-bar-chart'));
const MonsterClassBarChart = lazy(() => import('./components/charts/monster-class-bar-chart'));
const MonsterClassPieChart = lazy(() => import('./components/charts/monster-class-pie-chart'));
const MonsterPLHistogramChart = lazy(() => import('./components/charts/monster-pl-histogram-chart'));
const MonsterPLIdDotChart = lazy(() => import('./components/charts/monster-pl-id-dot-chart'));
const MonsterTrainerChart = lazy(() => import('./components/charts/monster-trainer-chart'));
const MonsterTrainerPLChart = lazy(() => import('./components/charts/monster-trainer-pl-chart'));
const MonsterScanChart = lazy(() => import('./components/charts/monster-scan-chart'));
const MonsterMitigationChart = lazy(() => import('./components/charts/monster-mitigation-chart'));

const elementsGroup = (['fire', 'cold', 'wind', 'elec', 'dark', 'holy'] as const).reduce<MonsterDatabase.Element[][]>((result, element, index) => {
  const chunk = Math.floor(index / 2);
  result[chunk] = result[chunk] ?? [];
  result[chunk].push(element);
  return result;
}, []);

export default function MainEntry() {
  const isIsekai = useIsIsekai();
  const setTrainerName = useSetTrainer();

  useEffect(() => {
    const trainerUrlQuery = (new URL(window.location.href)).searchParams.get('trainer');
    if (trainerUrlQuery) {
      setTrainerName(trainerUrlQuery);
    }
  }, [setTrainerName]);

  return (
    <main className="p-8">
      <h1 className="text-3xl leading-[38px] justify-center font-bold my-5 flex items-center">HentaiVerse Monster Database (Rebuild) <IsekaiSwitch /></h1>
      <Tabs.Root defaultValue="data-tables">
        <Tabs.List color="amber" highContrast>
          <Tabs.Trigger value="data-tables">Data Tables</Tabs.Trigger>
          <Tabs.Trigger value="charts">Charts</Tabs.Trigger>
        </Tabs.List>
        <Box pt="4">
          <Tabs.Content value="data-tables">
            <Suspense fallback={null}>
              {!isIsekai && <FilterByTrainerForm />}
              <MonsterDataTable />
            </Suspense>
          </Tabs.Content>
          <Tabs.Content value="charts">
            <AntiAdBlock>
              <Row>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterAttackBarChart />
                  </Suspense>
                </Col>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterClassBarChart />
                  </Suspense>
                </Col>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterClassPieChart />
                  </Suspense>
                </Col>
              </Row>
              <Row>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterPLHistogramChart />
                  </Suspense>
                </Col>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterPLIdDotChart />
                  </Suspense>
                </Col>
              </Row>
              {!isIsekai && (
                <>
                  <Row>
                    <Col className="h-[500px]">
                      <Suspense fallback={<div>Loading...</div>}>
                        <MonsterTrainerChart />
                      </Suspense>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="h-[500px]">
                      <Suspense fallback={<div>Loading...</div>}>
                        <MonsterTrainerPLChart />
                      </Suspense>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col className="h-[500px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <MonsterScanChart />
                  </Suspense>
                </Col>
              </Row>
              {elementsGroup.map((elements) => (
                <Row key={elements.join(',')}>
                  {elements.map((element) => (
                    <Col className="h-[500px]" key={element}>
                      <Suspense fallback={<div>Loading...</div>}>
                        <MonsterMitigationChart type={element} />
                      </Suspense>
                    </Col>
                  ))}
                </Row>
              ))}
            </AntiAdBlock>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </main>
  );
}
