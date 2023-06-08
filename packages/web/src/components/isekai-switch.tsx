import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import { useCallback, useTransition } from 'react';
import { useIsIsekai, useSetIsIsekai } from './isekai-state';

export function IsekaiSwitch() {
  const isIsekai = useIsIsekai();
  const setIsIsekai = useSetIsIsekai();
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      className={clsx(
        'ml-2 mt-1 relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
        isIsekai ? 'bg-yellow-900' : 'bg-yellow-600'
      )}
      checked={isIsekai}
      onChange={useCallback((checked: boolean) => {
        startTransition(() => setIsIsekai(checked));
      }, [setIsIsekai])}
    >
      <span className="sr-only">Switch to {isIsekai ? 'Persistent' : 'Isekai'}</span>
      <span
        className={clsx(
          'pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 text-base leading-[34px]',
          isIsekai ? 'translate-x-9' : 'translate-x-0'
        )}
      >
        <span className="flex items-center justify-center w-full h-full">
          {
            // eslint-disable-next-line no-nested-ternary
            isPending
              ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={clsx(isIsekai ? 'stroke-yellow-900' : 'stroke-yellow-600', 'flex items-center justify-center w-4 h-4')} viewBox="0 0 38 38">
                  <g fill="none" fillRule="evenodd" strokeWidth="2" transform="translate(1 1)">
                    <circle cx="18" cy="18" r="18" strokeOpacity=".5" />
                    <path d="M36 18C36 8 28 0 18 0">
                      <animateTransform attributeName="transform" dur="1s" from="0 18 18" repeatCount="indefinite" to="360 18 18" type="rotate" />
                    </path>
                  </g>
                </svg>
              )
              : (isIsekai ? 'I' : 'P')
          }
        </span>
      </span>
    </Switch>
  );
}
