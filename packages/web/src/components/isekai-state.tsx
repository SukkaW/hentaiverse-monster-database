import type React from 'react';
import { createContext, useContext, useState } from 'react';

const IsIsekaiContext = createContext(false);
const DispatchIsIsekaiContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => { /* empty */ });

export const IsekaiProvider = (props: React.PropsWithChildren<unknown>) => {
  const [isIsekai, setIsIsekai] = useState(false);
  return (
    <IsIsekaiContext.Provider value={isIsekai}>
      <DispatchIsIsekaiContext.Provider value={setIsIsekai}>
        {props.children}
      </DispatchIsIsekaiContext.Provider>
    </IsIsekaiContext.Provider>
  );
};

export const useIsIsekai = () => useContext(IsIsekaiContext);
export const useSetIsIsekai = () => useContext(DispatchIsIsekaiContext);
