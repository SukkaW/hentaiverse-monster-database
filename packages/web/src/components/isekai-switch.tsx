import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import { startTransition, useCallback, useState } from 'react';
import { useIsIsekai, useSetIsIsekai } from './isekai-state';

export function IsekaiSwitch() {
  const isIsekai = useIsIsekai();
  const setIsIsekai = useSetIsIsekai();
  const [isIsekaiUI, setIsIsekaiUI] = useState(isIsekai);

  return (
    <Switch
      className={clsx('ml-2 mt-1 relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75', isIsekai ? 'bg-yellow-900' : 'bg-yellow-600')}
      checked={isIsekaiUI}
      onChange={useCallback((checked: boolean) => {
        setIsIsekaiUI(checked);
        startTransition(() => setIsIsekai(checked));
      }, [setIsIsekai])}
    >
      <span className="sr-only">Switch to {isIsekaiUI ? 'Persistent' : 'Isekai'}</span>
      <span
        className={clsx('pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 text-base leading-[34px]', isIsekaiUI ? 'translate-x-9' : 'translate-x-0')}
      >{isIsekaiUI ? 'I' : 'P'}</span>
    </Switch>
  );
}
