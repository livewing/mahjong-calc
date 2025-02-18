import { load } from 'js-yaml';
import type { Plugin } from 'vite';

const yamlFileRegex = /\.ya?ml$/;

const plugin = (): Plugin => ({
  name: 'yaml',
  transform: async (src, id) => {
    if (yamlFileRegex.test(id)) {
      const yaml = load(src, { onWarning: e => console.warn(e.toString()) });
      return {
        code: `export default ${JSON.stringify(yaml)};`,
        map: null
      };
    }
    return null;
  }
});
export default plugin;
