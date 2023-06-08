import { createContextState } from 'foxact/context-state';

const [SearchByTrainerProvider, useTrainer, useSetTrainer] = createContextState('');

export { SearchByTrainerProvider, useTrainer, useSetTrainer };
