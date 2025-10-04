import { useState } from 'react';
import { useHasAdBlockEnabled } from '../hooks/use-detect-adblock';

export function AntiAdBlock({ children }: React.PropsWithChildren) {
  const [insist, setInsist] = useState(false);
  const hasAdBlockEnabled = useHasAdBlockEnabled();
  if (!hasAdBlockEnabled) return children;
  if (insist) return children;
  return (
    <div>
      <h1>You appear to have ADBlock enabled!</h1>
      <p>I understand why you have ADBlock enabled (I really do!).</p>

      <p>However, the filtering rules you are using have <span className="font-bold">incorrectly blocked legitimate Web API usage</span>, which has break the site.</p>

      <p>Here is what you can do:</p>
      <ul className="list-disc list-inside">
        <li>
          Disable your ADBlock for domain <code>skk.moe</code> and all its subdomains <span className="font-bold">(Recommended!)</span>
        </li>
        <li>
          Disable / remove the following rule from your ADBlock: <code>skk.moe##+js(aopr, btoa)</code>
        </li>
        <li>
          Report the issue to the filtering rules maintainer at: <a href="https://github.com/uBlockOrigin/uAssets/issues" target="_blank" rel="noreferrer nofollow noopenner">https://github.com/uBlockOrigin/uAssets/issues</a>
        </li>
      </ul>

      <p>If you don&apos;t disable your ADBlock or remove the broken filter rule, you <span className="font-bold">might and will</span> encounter issues.</p>

      <button type="button" className="border-2 p-2 m-2 shadow-md" onClick={() => { window.location.reload(); }}>I have disabled my AdBlock or removed the broken rule</button>
      <button type="button" className="border-2 p-2 m-2 shadow-md" onClick={() => { setInsist(true); }}>I am aware the risk that site will break with my current AdBlock setup, and I insist continuing with AdBlock Enabled.</button>
    </div>
  );
}
