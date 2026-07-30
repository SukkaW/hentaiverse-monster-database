import { unstable_useUrlHashState as useUrlHashState } from 'foxact/use-url-hash-state';

function useTrainerState() {
  const [trainerName, setTrainerName] = useUrlHashState('trainer', '', { raw: true });
  return [trainerName ?? '', setTrainerName] as const;
}

function useTrainer() {
  return useTrainerState()[0];
}

export { useTrainer, useTrainerState };
