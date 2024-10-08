import { MonsterDataTable } from './components/data-tables';
import { FilterByTrainerForm } from './components/filter-by-trainer-form';
import { IsekaiSwitch } from './components/isekai-switch';
import { Tab } from '@headlessui/react';
import { Row, Col } from './components/row-col';
import { AntiAdBlock } from './components/anti-adblock';

import { clsx } from 'clsx';
import { Fragment, Suspense, lazy, useEffect } from 'react';
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
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-yellow-800/5 rounded-xl">
          <Tab as={Fragment}>{
            ({ selected }) => (
              <button
                type="button"
                className={clsx('w-full py-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-yellow-800 ring-white ring-opacity-60', selected ? 'text-[#5C0D12] bg-white shadow' : 'text-yellow-800 hover:opacity-75')}
              >
                Data Tables
              </button>
            )
          }</Tab>
          <Tab as={Fragment}>{
            ({ selected }) => (
              <button
                type="button"
                className={clsx('w-full py-2.5 text-sm leading-5 font-medium  rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-yellow-800 ring-white ring-opacity-60', selected ? 'text-[#5C0D12] bg-white shadow' : 'text-yellow-800 hover:opacity-75')}
              >
                Charts
              </button>
            )
          }</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="pt-4 relative">
            {
              () => (
                <Suspense fallback={null}>
                  {!isIsekai && <FilterByTrainerForm />}
                  <MonsterDataTable />
                </Suspense>
              )
            }
          </Tab.Panel>
          <Tab.Panel>
            {() => (
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
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}
