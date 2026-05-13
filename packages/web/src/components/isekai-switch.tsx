import { Badge, Flex, Spinner, Switch } from '@radix-ui/themes';
import { useCallback, useTransition } from 'react';
import { useIsIsekai, useSetIsIsekai } from './isekai-state';

export function IsekaiSwitch() {
  const isIsekai = useIsIsekai();
  const setIsIsekai = useSetIsIsekai();
  const [isPending, startTransition] = useTransition();

  return (
    <Flex asChild align="center" gap="2" ml="3">
      <label>
        <Switch
          checked={isIsekai}
          color="amber"
          disabled={isPending}
          aria-label={`Switch to ${isIsekai ? 'Persistent' : 'Isekai'}`}
          onCheckedChange={useCallback((checked: boolean) => {
            startTransition(() => setIsIsekai(checked));
          }, [setIsIsekai])}
        />
        <Flex align="center" gap="2">
          <Badge color="amber" variant="soft" size="2">
            {isPending ? <Spinner size="1" /> : (isIsekai ? 'Isekai' : 'Persistent')}
          </Badge>
        </Flex>
      </label>
    </Flex>
  );
}
