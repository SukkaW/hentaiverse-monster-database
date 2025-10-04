import { useEffect, StrictMode } from 'react';

import { IsekaiProvider } from './components/isekai-state';
import { useHasAdBlockEnabled } from './hooks/use-detect-adblock';
import MainEntry from './main';
import { SearchByTrainerProvider } from './components/search-by-trainer-state';

export function App() {
  useEffect(() => {
    if (window.location.hostname === 'hv-monster-dataview.pages.dev') {
      window.location.assign('https://hv-monster.skk.moe');
    }
  }, []);

  useHasAdBlockEnabled();

  return (
    <StrictMode>
      <IsekaiProvider>
        <SearchByTrainerProvider>
          <MainEntry />
        </SearchByTrainerProvider>
      </IsekaiProvider>
    </StrictMode>
  );
}
