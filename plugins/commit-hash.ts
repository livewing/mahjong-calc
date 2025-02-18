import { execFileSync } from 'node:child_process';
import type { Plugin } from 'vite';

const plugin = (): Plugin => ({
  name: 'commit-hash',
  config: () => ({
    define: {
      COMMIT_HASH: JSON.stringify(
        execFileSync('git', ['rev-parse', 'HEAD'], {
          encoding: 'utf-8'
        }).trim()
      )
    }
  })
});
export default plugin;
