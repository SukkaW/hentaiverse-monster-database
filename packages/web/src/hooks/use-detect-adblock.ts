import { useState } from 'react';
import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect';

const alertMsg = `You appear to have ADBlock enabled!
I understand why you have ADBlock enabled (I really do!).

However, the filtering rules you are using have **incorrectly** blocked legitimate Web API usage, which has break the data table and chart.

Here is what you can do:
- Disable your ADBlock for domain *skk.moe* and all its subdomains (Recommended!)
- Disable / remove the following rule from your ADBlock: skk.moe##+js(aopr, btoa)
- Report the issue to the filtering rules maintainer at: https://github.com/uBlockOrigin/uAssets/issues

If you don't disable your ADBlock or remove the broken filter rule, you *might and will* encounter issues.`;

export function useHasAdBlockEnabled() {
  // eslint-disable-next-line @eslint-react/naming-convention/use-state -- one use
  const [hasEnabledAdBlock] = useState(
    typeof window === 'object'
      ? (() => {
        try {
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- detect adblock
          return !(typeof btoa === 'function');
        } catch {
          return true;
        }
      })()
      : false
  );

  useLayoutEffect(() => {
    if (hasEnabledAdBlock) {
      // eslint-disable-next-line no-alert -- warning
      alert(alertMsg);
    }
  }, [hasEnabledAdBlock]);

  return hasEnabledAdBlock;
}
