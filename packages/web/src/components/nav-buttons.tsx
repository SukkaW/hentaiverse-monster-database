import { useCallback } from 'react';
import { useIsIsekai, useSetIsIsekai } from './isekai-state';

export function NavButtons() {
  const isIsekai = useIsIsekai();
  const setIsIsekai = useSetIsIsekai();

  return (
    <div className="flex space-x-3 mb-4 text-sm font-semibold max-w-sm mx-auto">
      <div className="flex-auto flex space-x-3 w-9 h-9">
        <button
          className="w-full flex items-center justify-center rounded-full bg-[#E3E0D1] text-[#5C0D12]"
          onClick={useCallback(() => setIsIsekai(isIskai => !isIskai), [setIsIsekai])}
        >
          Switch to {isIsekai ? 'Persistent' : 'Isekai'}
        </button>
      </div>
    </div>
  );
}
