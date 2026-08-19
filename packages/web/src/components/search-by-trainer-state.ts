import { unstable_useUrlHashState as useUrlHashState } from 'foxact/use-url-hash-state';

export function useTrainerState() {
  const [trainerName, setTrainerName] = useUrlHashState('trainer', '', { raw: true });
  return [trainerName ?? '', setTrainerName] as const;
}

export function useTrainer() {
  return useTrainerState()[0];
}
