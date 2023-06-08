import { createContextState } from 'foxact/context-state';

const [IsekaiProvider, useIsIsekai, useSetIsIsekai] = createContextState(false);

export { IsekaiProvider, useIsIsekai, useSetIsIsekai };
